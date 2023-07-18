import { Text } from "@chakra-ui/react";
import { UnlistenFn } from "@tauri-apps/api/event";
import { readDir } from "@tauri-apps/api/fs";
import { path } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { watch } from "tauri-plugin-fs-watch-api";
import Section from "../../components/Section";
import { useGame } from "../store";
import { validateDirectoryPath } from "../validation";
import Table from "../../components/Table";

type SectionHacksProps = {
  gameId: string;
};

type Hack = {
  directory: string;
  name: string;
  sfc: string;
};

const isHack = (maybeHack: Partial<Hack>): maybeHack is Hack => {
  return (
    typeof maybeHack.directory === "string" &&
    typeof maybeHack.name === "string" &&
    typeof maybeHack.sfc === "string"
  );
};

const readGameDirectory = async (gameDirectory: string): Promise<Hack[]> => {
  const hacks = (await readDir(gameDirectory, { recursive: true }))
    .map((directory) => ({
      directory: directory.path,
      name: directory.name ?? "-",
      sfc: directory.children?.find((child) => child.name?.endsWith(".sfc"))
        ?.name,
    }))
    .filter(isHack);
  for (const hack of hacks)
    hack.sfc = await path.join(hack.directory, hack.sfc!);
  return hacks;
};

const hacksTableColumns = [{ header: "Name", key: "name" as const }];

function SectionHacks({ gameId }: SectionHacksProps) {
  const [game] = useGame(gameId);
  const [hacks, setHacks] = useState<Hack[]>([]);

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
    <Section isDefaultExpanded title="Hacks">
      {hacks.length > 0 ? (
        <Table columns={hacksTableColumns} data={hacks} />
      ) : (
        <Text fontSize="sm">Nothing</Text>
      )}
    </Section>
  );
}

export default SectionHacks;
