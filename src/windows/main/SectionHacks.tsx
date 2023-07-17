import { Text } from "@chakra-ui/react";
import { UnlistenFn } from "@tauri-apps/api/event";
import { readDir } from "@tauri-apps/api/fs";
import { useCallback, useEffect, useState } from "react";
import { watch } from "tauri-plugin-fs-watch-api";
import Section from "../../components/Section";
import { useGame } from "../store";
import { validateDirectoryPath } from "../validation";
import Table from "../../components/Table";

type SectionHacksProps = {
  gameId: string;
};

const hacksTableColumns = [{ header: "Name", key: "name" as const }];

function SectionHacks({ gameId }: SectionHacksProps) {
  const [game] = useGame(gameId);
  const [hacks, setHacks] = useState<{ name: string }[]>([]);

  const readGameDirectory = useCallback(async () => {
    const entries = await readDir(game.directory);
    setHacks(
      entries
        .filter((entry) => !!entry.children)
        .map((entry) => ({ name: entry.name ?? "-" }))
    );
  }, [game.directory]);

  useEffect(() => {
    const stopWatchingRef: { current: UnlistenFn } = { current: () => {} };

    const watchGameDirectory = async () => {
      if (!!(await validateDirectoryPath(game.directory))) {
        setHacks([]);
        return;
      }

      const stopWatching = await watch(
        game.directory,
        () => readGameDirectory(),
        { recursive: true }
      );
      stopWatchingRef.current = stopWatching;

      readGameDirectory();
    };

    watchGameDirectory();

    return () => stopWatchingRef.current();
  }, [game.directory, readGameDirectory]);

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
