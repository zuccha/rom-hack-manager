import { useCallback } from "react";
import {
  SetterOrUpdater,
  atom,
  atomFamily,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { recoilPersist } from "recoil-persist";
import { z } from "zod";

/** Types */

const GameSchema = z.object({
  directory: z.string(),
  id: z.string(),
  name: z.string(),
  originalCopy: z.string(),
});

const ConfigurationSchema = z.object({
  gamesById: z.record(z.string(), GameSchema),
  gameIds: z.array(z.string()),
  selectedGameIndex: z.number(),
});

export type Game = z.infer<typeof GameSchema>;
export type Configuration = z.infer<typeof ConfigurationSchema>;

/** States */

const { persistAtom } = recoilPersist();

const gameStateFamily = atomFamily<Game, string>({
  key: "Game",
  default: { directory: "", id: "", name: "", originalCopy: "" },
  effects_UNSTABLE: [persistAtom],
});

const gameIdsState = atom<string[]>({
  key: "GameIds",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

const selectedGameIndexState = atom<number>({
  key: "SelectedGameIndex",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

const selectedGameIdSelector = selector({
  key: "SelectedGameId",
  get: ({ get }) => {
    const index = get(selectedGameIndexState);
    const ids = get(gameIdsState);
    return ids[index];
  },
});

/** Hooks */

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
  const [game, setGame] = useRecoilState(gameStateFamily(id));

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

export const useGameIds = (): [
  string[],
  {
    create: (gameWithoutId: Omit<Game, "id">) => void;
    remove: (id: string) => void;
  }
] => {
  const [gameIds, setGameIds] = useRecoilState(gameIdsState);

  const create = useRecoilCallback(
    ({ set }) =>
      ({ name, directory, originalCopy }: Omit<Game, "id">) => {
        setGameIds((oldGameIds) => {
          const id = `game_${Date.now()}`;
          set(gameStateFamily(id), { directory, id, name, originalCopy });
          return [...oldGameIds, id];
        });
      },
    []
  );

  const remove = useRecoilCallback(
    ({ reset }) =>
      (id: string) => {
        setGameIds((oldGameIds) => {
          const newGameIds = oldGameIds.filter((otherId) => otherId !== id);
          reset(gameStateFamily(id));
          return newGameIds;
        });
      },
    []
  );

  return [gameIds, { create, remove }];
};

export const useSelectedGameIndex = (): [
  number,
  { set: SetterOrUpdater<number> }
] => {
  const [selectedGameIndex, setSelectedGameIndex] = useRecoilState(
    selectedGameIndexState
  );

  return [selectedGameIndex, { set: setSelectedGameIndex }];
};

export const useSelectedGameId = (): [string | undefined] => {
  const selectedGameId = useRecoilValue(selectedGameIdSelector);

  return [selectedGameId];
};
