import z from "zod";
import { Game, gameSchema, gameStore } from "./game";
import { createLocalStore } from "../utils/local-store";
import { useCallback } from "react";

export const gameIdsStore = createLocalStore(
  "GameIds",
  [],
  z.array(z.string()).parse
);

const selectedGameIndexStore = createLocalStore(
  "SelectedGameIndex",
  0,
  z.number().parse
);

export const useGameIds = (): [
  string[],
  {
    create: (gameWithoutId: Omit<Game, "id">) => void;
    remove: (id: string) => void;
  }
] => {
  const [gameIds, setGameIds] = gameIdsStore.use();

  const create = useCallback(
    ({ name, directory, originalCopy }: Omit<Game, "id">) => {
      setGameIds((oldGameIds) => {
        const id = `game_${Date.now()}`;
        gameStore.set(id)({ directory, id, name, originalCopy });
        return [...oldGameIds, id];
      });
    },
    []
  );

  const remove = useCallback((id: string) => {
    setGameIds((oldGameIds) => {
      const newGameIds = oldGameIds.filter((otherId) => otherId !== id);
      gameStore.remove(id);
      return newGameIds;
    });
  }, []);

  return [gameIds, { create, remove }];
};

export const useSelectedGameIndex = selectedGameIndexStore.use;

export const useSelectedGameId = (): [string | undefined] => {
  const selectedGameIndex = selectedGameIndexStore.useValue();
  const gameIds = gameIdsStore.useValue();

  return [gameIds[selectedGameIndex]];
};
