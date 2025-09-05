import { Flex, Icon, Text } from "@chakra-ui/react";
import { UnlistenFn } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { join } from "@tauri-apps/api/path";
import { readDir, remove, watch } from "@tauri-apps/plugin-fs";
import { CirclePlayIcon, FolderIcon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Dialog from "../../components/Dialog";
import Section from "../../components/Section";
import Table from "../../components/Table";
import TextEditor from "../../components/TextEditor";
import useItemRemovalDialog from "../../hooks/useItemRemovalDialog";
import { useGame, useGlobalSettings } from "../store";
import { validateDirectoryPath } from "../validation";

type SectionHacksProps = {
  gameId: string;
};

type Hack = {
  directory: string;
  name: string;
  sfcName: string;
  sfcPath: string;
};

function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

const readGameDirectory = async (gameDirectory: string): Promise<Hack[]> => {
  const entries = await readDir(gameDirectory);

  const hacks = (
    await Promise.all(
      entries.map(async (entry) => {
        if (!entry.isDirectory) return undefined;

        const name = entry.name ?? "-";

        const directory = await join(gameDirectory, name);
        const children = await readDir(directory);
        const sfc = children.find((c) => (c.name ?? "").endsWith(".sfc"));
        return sfc
          ? ({
              directory,
              name,
              sfcName: sfc.name,
              sfcPath: await join(directory, sfc.name),
            } as Hack)
          : undefined;
      })
    )
  )
    .filter(notUndefined)
    .sort((hack1, hack2) => {
      if (hack1.name < hack2.name) return -1;
      if (hack1.name > hack2.name) return 1;
      return 0;
    });

  return hacks;
};

const hacksTableColumns = [
  {
    header: "Name",
    key: "name" as const,
  },
  {
    header: "SFC",
    key: "sfcName" as const,
  },
];

function SectionHacks({ gameId }: SectionHacksProps) {
  const [globalSettings] = useGlobalSettings();
  const [game] = useGame(gameId);
  const [hacks, setHacks] = useState<Hack[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const clearNameFilter = useCallback(() => setNameFilter(""), []);

  const deleteHack = useCallback((hack: Hack) => {
    remove(hack.directory, { recursive: true });
  }, []);

  const hackDeletionDialog = useItemRemovalDialog(
    deleteHack,
    globalSettings.askForConfirmationBeforeDeletingHack
  );

  const hacksTableActions = useMemo(
    () => [
      {
        icon: <Icon as={CirclePlayIcon} />,
        label: "Play",
        onClick: (hack: Hack) => {
          if (globalSettings.emulatorPath) {
            invoke("open_with_selected_app", {
              filePath: hack.sfcPath,
              emulatorPath: globalSettings.emulatorPath,
              emulatorArgs: globalSettings.emulatorArgs,
            });
          } else {
            invoke("open_with_default_app", { path: hack.sfcPath });
          }
        },
      },
      {
        icon: <Icon as={FolderIcon} />,
        label: "Open folder",
        onClick: (hack: Hack) =>
          invoke("open_with_default_app", { path: hack.directory }),
      },
      {
        icon: <Icon as={TrashIcon} />,
        label: "Delete",
        onClick: (hack: Hack) => hackDeletionDialog.openOrRemove(hack),
      },
    ],
    [hackDeletionDialog.openOrRemove]
  );

  useEffect(() => {
    const stopWatchingRef: { current: UnlistenFn } = { current: () => {} };

    const watchGameDirectory = async () => {
      if (!!(await validateDirectoryPath(game.directory))) {
        setHacks([]);
        return;
      }

      const stopWatching = await watch(
        game.directory,
        () => readGameDirectory(game.directory).then(setHacks),
        { recursive: true }
      );
      stopWatchingRef.current = stopWatching;

      readGameDirectory(game.directory).then(setHacks);
    };

    watchGameDirectory();

    return () => stopWatchingRef.current();
  }, [game.directory]);

  const filteredHacks = useMemo(() => {
    return hacks.filter((hack) =>
      hack.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }, [hacks, nameFilter]);

  return (
    <>
      <Section isDefaultExpanded title="Hacks">
        <Flex direction="column" gap={3}>
          <TextEditor
            onChange={setNameFilter}
            onClear={clearNameFilter}
            placeholder="Search by name"
            value={nameFilter}
          />

          {filteredHacks.length > 0 ? (
            <Table
              actions={hacksTableActions}
              columns={hacksTableColumns}
              data={filteredHacks}
            />
          ) : (
            <Text fontSize="sm">
              {nameFilter ? "Nothing, check the filter" : "Nothing"}
            </Text>
          )}
        </Flex>
      </Section>

      <Dialog
        description="Caution: Deleting the hack will delete the folder! This cannot be undone."
        isOpen={hackDeletionDialog.isOpen}
        onCancel={hackDeletionDialog.close}
        onConfirm={hackDeletionDialog.closeAndRemove}
        title="Delete hack?"
      />
    </>
  );
}

export default SectionHacks;
