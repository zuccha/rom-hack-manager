import z from "zod";
import { useCallback } from "react";
import { createMemoryStore } from "../utils/memory-store";

export const gameCreationDataSchema = z.object({
  directory: z.string().default(""),
  name: z.string().default(""),
  originalCopy: z.string().default(""),
});

export type GameCreationData = z.infer<typeof gameCreationDataSchema>;

export const gameCreationDataStore = createMemoryStore(
  gameCreationDataSchema.parse({})
);

export const useGameCreationData = (): [
  GameCreationData,
  {
    setDirectory: (name: string) => void;
    setName: (name: string) => void;
    setOriginalCopy: (name: string) => void;
  }
] => {
  const [gameCreationData, setGameCreationData] = gameCreationDataStore.use();

  const setDirectory = useCallback(
    (directory: string) =>
      setGameCreationData((oldGameCreationData) => ({
        ...oldGameCreationData,
        directory,
      })),
    [setGameCreationData]
  );

  const setName = useCallback(
    (name: string) =>
      setGameCreationData((oldGameCreationData) => ({
        ...oldGameCreationData,
        name,
      })),
    [setGameCreationData]
  );

  const setOriginalCopy = useCallback(
    (originalCopy: string) => {
      setGameCreationData((oldGameCreationData) => ({
        ...oldGameCreationData,
        originalCopy,
      }));
    },
    [setGameCreationData]
  );

  return [gameCreationData, { setDirectory, setName, setOriginalCopy }];
};
