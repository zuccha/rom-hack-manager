import { useCallback } from "react";
import {
  SetterOrUpdater,
  atom,
  atomFamily,
  useRecoilCallback,
  useRecoilState,
} from "recoil";
import { z } from "zod";
import Persistor from "./Persistor";

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

/** Persistor */

const ConfigurationPersistor = new Persistor<Configuration>(
  "configuration.json",
  { gamesById: {}, gameIds: [], selectedGameIndex: 0 },
  ConfigurationSchema.parse
);

/** States */

const gameStateFamily = atomFamily<Game, string>({
  key: "Game",
  default: { directory: "", id: "", name: "", originalCopy: "" },
});

const gameIdsState = atom<string[]>({
  key: "GameIds",
  default: [],
});

const selectedGameIndexState = atom<number>({
  key: "GameIndex",
  default: 0,
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
    (directory: string) => {
      setGame((oldGame) => {
        if (!ConfigurationPersistor.data.gamesById[oldGame.id])
          ConfigurationPersistor.data.gamesById[oldGame.id] = oldGame;
        ConfigurationPersistor.data.gamesById[oldGame.id]!.directory =
          directory;
        return { ...oldGame, directory };
      });
    },
    [setGame]
  );

  const setName = useCallback(
    (name: string) => {
      setGame((oldGame) => {
        if (!ConfigurationPersistor.data.gamesById[oldGame.id])
          ConfigurationPersistor.data.gamesById[oldGame.id] = oldGame;
        ConfigurationPersistor.data.gamesById[oldGame.id]!.name = name;
        return { ...oldGame, name };
      });
    },
    [setGame]
  );

  const setOriginalCopy = useCallback(
    (originalCopy: string) => {
      setGame((oldGame) => {
        if (!ConfigurationPersistor.data.gamesById[oldGame.id])
          ConfigurationPersistor.data.gamesById[oldGame.id] = oldGame;
        ConfigurationPersistor.data.gamesById[oldGame.id]!.originalCopy =
          originalCopy;
        return { ...oldGame, originalCopy };
      });
    },
    [setGame]
  );

  return [game, { setDirectory, setName, setOriginalCopy }];
};

export const useGameIds = (): [
  string[],
  {
    create: (name: string, directory: string, originalCopy: string) => void;
    remove: (id: string) => void;
  }
] => {
  const [gameIds, setGameIds] = useRecoilState(gameIdsState);

  const create = useRecoilCallback(
    ({ set }) =>
      (name: string, directory: string, originalCopy: string) => {
        setGameIds((oldGameIds) => {
          const id = "TODO";
          const game = { directory, id, name, originalCopy };
          const newGameIds = [...oldGameIds, id];
          ConfigurationPersistor.data.gameIds = newGameIds;
          ConfigurationPersistor.data.gamesById[id] = game;
          set(gameStateFamily(id), game);
          set(selectedGameIndexState, newGameIds.length - 1);
          return newGameIds;
        });
      },
    []
  );

  const remove = useRecoilCallback(
    ({ reset }) =>
      (id: string) => {
        setGameIds((oldGameIds) => {
          const newGameIds = oldGameIds.filter((otherId) => otherId !== id);
          ConfigurationPersistor.data.gameIds = newGameIds;
          delete ConfigurationPersistor.data.gamesById[id];
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
