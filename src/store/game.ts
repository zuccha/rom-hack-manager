import z from "zod";
import { useCallback } from "react";
import { createLocalSetStore } from "../utils/local-set-store";

export const gameSchema = z.object({
  directory: z.string().default(""),
  id: z.string().default(""),
  name: z.string().default(""),
  originalCopy: z.string().default(""),
});

export type Game = z.infer<typeof gameSchema>;

export const gameStore = createLocalSetStore(
  "Game",
  gameSchema.parse({}),
  gameSchema.parse
);

export const useGame = (
  id: string
): [
  Game,
  {
    setDirectory: (directory: string) => void;
    setName: (name: string) => void;
    setOriginalCopy: (name: string) => void;
  }
] => {
  const [game, setGame] = gameStore.use(id);

  const setDirectory = useCallback(
    (directory: string) => setGame((oldGame) => ({ ...oldGame, directory })),
    [setGame]
  );

  const setName = useCallback(
    (name: string) => setGame((oldGame) => ({ ...oldGame, name })),
    [setGame]
  );

  const setOriginalCopy = useCallback(
    (originalCopy: string) => {
      setGame((oldGame) => ({ ...oldGame, originalCopy }));
    },
    [setGame]
  );

  return [game, { setDirectory, setName, setOriginalCopy }];
};
