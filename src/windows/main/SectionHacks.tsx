import { Flex, Icon, Text } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/core";
import { UnlistenFn } from "@tauri-apps/api/event";
import { join } from "@tauri-apps/api/path";
import { readDir, remove, watch } from "@tauri-apps/plugin-fs";
import { CirclePlayIcon, FolderIcon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Dialog from "../../components/Dialog";
import Section from "../../components/Section";
import Table from "../../components/Table";
import TextEditor from "../../components/TextEditor";
import useItemRemovalDialog from "../../hooks/useItemRemovalDialog";
import { useGame } from "../../store/game";
import { useGlobalSettings } from "../../store/global-settings";
import { validateDirectoryPath } from "../validation";

type SectionHacksProps = {
  gameId: string;
};

type Hack = {
  directory: string;
  name: string;
  sfcName: string;
  sfcPath: string;
  isFirstSfc: boolean;
};

function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

const readGameDirectory = async (gameDirectory: string): Promise<Hack[]> => {
  const entries = await readDir(gameDirectory);

  const hacks = (
    await Promise.all(
      entries.map(async (entry) => {
        if (!entry.isDirectory) return [] as Hack[];

        const name = entry.name ?? "-";

        const directory = await join(gameDirectory, name);
        const children = await readDir(directory);
        const sfcFiles = children.filter((c) =>
          (c.name ?? "").endsWith(".sfc")
        );

        if (sfcFiles.length === 0) return [] as Hack[];

        const hacksForDirectory = await Promise.all(
          sfcFiles.map(async (sfc, index) => ({
            directory,
            name,
            sfcName: sfc.name ?? "-",
            sfcPath: await join(directory, sfc.name ?? ""),
            isFirstSfc: index === 0,
          }))
        );

        return hacksForDirectory;
      })
    )
  )
    .flat()
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
    format: (hack: Hack) => (hack.isFirstSfc ? hack.name : ""),
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
    (async () => {
      try {
        await remove(hack.sfcPath);

        const children = await readDir(hack.directory);
        const remainingSfcFiles = children.filter((c) =>
          (c.name ?? "").endsWith(".sfc")
        );

        if (remainingSfcFiles.length === 0) {
          await remove(hack.directory, { recursive: true });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const hackDeletionDialog = useItemRemovalDialog(
    deleteHack,
    globalSettings.askForConfirmationBeforeDeletingHack
  );

  const { openOrRemove } = hackDeletionDialog;

  const getHacksTableActions = useCallback(
    (hack: Hack) => {
      const actions = [
        {
          icon: <Icon as={CirclePlayIcon} />,
          label: "Play",
          onClick: (selectedHack: Hack) => {
            if (globalSettings.emulatorPath) {
              invoke("open_with_selected_app", {
                emulatorArgs: globalSettings.emulatorArgs,
                emulatorPath: globalSettings.emulatorPath,
                filePath: selectedHack.sfcPath,
              });
            } else {
              invoke("open_with_default_app", { path: selectedHack.sfcPath });
            }
          },
        },
        hack.isFirstSfc
          ? {
              icon: <Icon as={FolderIcon} />,
              label: "Open folder",
              onClick: (selectedHack: Hack) =>
                invoke("open_with_default_app", {
                  path: selectedHack.directory,
                }),
            }
          : {
              icon: <></>,
              isDisabled: true,
              label: "",
              onClick: () => {},
            },
        {
          icon: <Icon as={TrashIcon} />,
          label: "Delete",
          onClick: (selectedHack: Hack) => openOrRemove(selectedHack),
        },
      ];

      return actions;
    },
    [globalSettings.emulatorArgs, globalSettings.emulatorPath, openOrRemove]
  );

  useEffect(() => {
    const stopWatchingRef: { current: UnlistenFn } = { current: () => {} };

    const watchGameDirectory = async () => {
      if (await validateDirectoryPath(game.directory)) {
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
              columns={hacksTableColumns}
              data={filteredHacks}
              getRowActions={getHacksTableActions}
            />
          ) : (
            <Text fontSize="sm">
              {nameFilter ? "Nothing, check the filter" : "Nothing"}
            </Text>
          )}
        </Flex>
      </Section>

      <Dialog
        description="Caution: Deleting the hack will remove the selected .sfc file. If no .sfc files remain, the folder will be deleted. This cannot be undone."
        isOpen={hackDeletionDialog.isOpen}
        onCancel={hackDeletionDialog.close}
        onConfirm={hackDeletionDialog.closeAndRemove}
        title="Delete hack?"
      />
    </>
  );
}

export default SectionHacks;
