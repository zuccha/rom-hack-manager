import z from "zod";
import { useCallback } from "react";
import { createMemorySetStore } from "../utils/memory-set-store";

export const gameDownloadDataSchema = z.object({
  downloadUrl: z.string().default(""),
  name: z.string().default(""),
});

export type GameDownloadData = z.infer<typeof gameDownloadDataSchema>;

export const gameDownloadDataStore = createMemorySetStore(
  gameDownloadDataSchema.parse({})
);

export const useGameDownloadData = (
  id: string
): [
  GameDownloadData,
  {
    setName: (name: string) => void;
    setDownloadUrl: (name: string) => void;
  }
] => {
  const [gameDownloadData, setGameDownloadData] = gameDownloadDataStore.use(id);

  const setName = useCallback(
    (name: string) =>
      setGameDownloadData((oldGameDownloadData) => ({
        ...oldGameDownloadData,
        name,
      })),
    [setGameDownloadData]
  );

  const setDownloadUrl = useCallback(
    (downloadUrl: string) => {
      setGameDownloadData((oldGameDownloadData) => ({
        ...oldGameDownloadData,
        downloadUrl,
      }));
    },
    [setGameDownloadData]
  );

  return [gameDownloadData, { setName, setDownloadUrl }];
};
