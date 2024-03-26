import { Icon, Text } from "@chakra-ui/react";
import { UnlistenFn } from "@tauri-apps/api/event";
import { readDir, removeDir } from "@tauri-apps/api/fs";
import { invoke, path } from "@tauri-apps/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdDelete, MdPlayCircle, MdFolder } from "react-icons/md";
import { watch } from "tauri-plugin-fs-watch-api";
import Dialog from "../../components/Dialog";
import Section from "../../components/Section";
import Table from "../../components/Table";
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

const isHack = (maybeHack: Partial<Hack>): maybeHack is Hack => {
  return (
    typeof maybeHack.directory === "string" &&
    typeof maybeHack.name === "string" &&
    typeof maybeHack.sfcName === "string" &&
    typeof maybeHack.sfcPath === "string"
  );
};

const readGameDirectory = async (gameDirectory: string): Promise<Hack[]> => {
  const hacks = (await readDir(gameDirectory, { recursive: true }))
    .map((directory) => ({
      directory: directory.path,
      name: directory.name ?? "-",
      sfcName: directory.children?.find((child) => child.name?.endsWith(".sfc"))
        ?.name,
      sfcPath: "",
    }))
    .filter(isHack)
    .sort((hack1, hack2) => {
      if (hack1.name < hack2.name) return -1;
      if (hack1.name > hack2.name) return 1;
      return 0;
    });
  for (const hack of hacks) {
    hack.sfcPath = await path.join(hack.directory, hack.sfcName!);
  }
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

  const deleteHack = useCallback((hack: Hack) => {
    removeDir(hack.directory, { recursive: true });
  }, []);

  const hackDeletionDialog = useItemRemovalDialog(
    deleteHack,
    globalSettings.askForConfirmationBeforeDeletingHack
  );

  const hacksTableActions = useMemo(
    () => [
      {
        icon: <Icon as={MdPlayCircle} />,
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
        icon: <Icon as={MdFolder} />,
        label: "Open folder",
        onClick: (hack: Hack) =>
          invoke("open_with_default_app", { path: hack.directory }),
      },
      {
        icon: <Icon as={MdDelete} />,
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

  return (
    <>
      <Section isDefaultExpanded title="Hacks">
        {hacks.length > 0 ? (
          <Table
            actions={hacksTableActions}
            columns={hacksTableColumns}
            data={hacks}
            highlightRowOnHover
          />
        ) : (
          <Text fontSize="sm">Nothing</Text>
        )}
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
