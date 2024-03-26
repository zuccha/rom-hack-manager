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
import { z } from "zod";
import { storePersist } from "./store-persist";

/** Types */

const GlobalSettingsSchema = z.object({
  askForConfirmationBeforeDeletingHack: z.boolean(),
  askForConfirmationBeforeRemovingGame: z.boolean(),
  openHackFolderAfterDownload: z.boolean(),
  cookie: z.string(),
  emulatorPath: z.string(),
  emulatorArgs: z.string(),
});

const GameSchema = z.object({
  directory: z.string(),
  id: z.string(),
  name: z.string(),
  originalCopy: z.string(),
});

const GameDownloadDataSchema = z.object({
  downloadUrl: z.string(),
  name: z.string(),
});

const GameCreationDataSchema = z.object({
  directory: z.string(),
  name: z.string(),
  originalCopy: z.string(),
});

const ConfigurationSchema = z.object({
  gamesById: z.record(z.string(), GameSchema),
  gameIds: z.array(z.string()),
  selectedGameIndex: z.number(),
});

export type GlobalSettings = z.infer<typeof GlobalSettingsSchema>;
export type Game = z.infer<typeof GameSchema>;
export type GameDownloadData = z.infer<typeof GameDownloadDataSchema>;
export type GameCreationData = z.infer<typeof GameCreationDataSchema>;
export type Configuration = z.infer<typeof ConfigurationSchema>;

/** States */

const { persistAtom, persistAtomWithDefaults } = storePersist();

const defaultGlobalSettings = {
  askForConfirmationBeforeDeletingHack: true,
  askForConfirmationBeforeRemovingGame: true,
  openHackFolderAfterDownload: false,
  cookie: "",
  emulatorPath: "",
  emulatorArgs: "%1",
};

const globalSettingsState = atom<GlobalSettings>({
  key: "GlobalSettings",
  default: defaultGlobalSettings,
  effects_UNSTABLE: [persistAtomWithDefaults(defaultGlobalSettings)],
});

const defaultGame = {
  directory: "",
  id: "",
  name: "",
  originalCopy: "",
};

const gameStateFamily = atomFamily<Game, string>({
  key: "Game",
  default: defaultGame,
  effects_UNSTABLE: [persistAtomWithDefaults(defaultGame)],
});

const gameDownloadDataStateFamily = atomFamily<GameDownloadData, string>({
  key: "GameDownloadData",
  default: { name: "", downloadUrl: "" },
});

const gameCreationDataState = atom<GameCreationData>({
  key: "GameCreationData",
  default: { directory: "", name: "", originalCopy: "" },
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

export const useGlobalSettings = (): [
  GlobalSettings,
  {
    setAskForConfirmationBeforeDeletingHack: (value: boolean) => void;
    setAskForConfirmationBeforeRemovingGame: (value: boolean) => void;
    setOpenHackFolderAfterDownload: (value: boolean) => void;
    setCookie: (value: string) => void;
    setEmulatorPath: (value: string) => void;
    setEmulatorArgs: (value: string) => void;
  }
] => {
  const [globalSettings, setGlobalSettings] =
    useRecoilState(globalSettingsState);

  const setAskForConfirmationBeforeDeletingHack = useCallback(
    (askForConfirmationBeforeDeletingHack: boolean) =>
      setGlobalSettings((oldGlobalSettings) => ({
        ...oldGlobalSettings,
        askForConfirmationBeforeDeletingHack,
      })),
    [setGlobalSettings]
  );

  const setAskForConfirmationBeforeRemovingGame = useCallback(
    (askForConfirmationBeforeRemovingGame: boolean) =>
      setGlobalSettings((oldGlobalSettings) => ({
        ...oldGlobalSettings,
        askForConfirmationBeforeRemovingGame,
      })),
    [setGlobalSettings]
  );

  const setOpenHackFolderAfterDownload = useCallback(
    (openHackFolderAfterDownload: boolean) =>
      setGlobalSettings((oldGlobalSettings) => ({
        ...oldGlobalSettings,
        openHackFolderAfterDownload,
      })),
    [setGlobalSettings]
  );

  const setCookie = useCallback(
    (cookie: string) =>
      setGlobalSettings((oldGlobalSettings) => ({
        ...oldGlobalSettings,
        cookie,
      })),
    [setGlobalSettings]
  );

  const setEmulatorPath = useCallback(
    (emulatorPath: string) =>
      setGlobalSettings((oldGlobalSettings) => ({
        ...oldGlobalSettings,
        emulatorPath,
      })),
    [setGlobalSettings]
  );

  const setEmulatorArgs = useCallback(
    (emulatorArgs: string) =>
      setGlobalSettings((oldGlobalSettings) => ({
        ...oldGlobalSettings,
        emulatorArgs,
      })),
    [setGlobalSettings]
  );

  return [
    globalSettings,
    {
      setAskForConfirmationBeforeDeletingHack,
      setAskForConfirmationBeforeRemovingGame,
      setOpenHackFolderAfterDownload,
      setCookie,
      setEmulatorPath,
      setEmulatorArgs,
    },
  ];
};

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

export const useGameDownloadData = (
  id: string
): [
  GameDownloadData,
  {
    setName: (name: string) => void;
    setDownloadUrl: (name: string) => void;
  }
] => {
  const [gameDownloadData, setGameDownloadData] = useRecoilState(
    gameDownloadDataStateFamily(id)
  );

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

export const useGameCreationData = (): [
  GameCreationData,
  {
    setDirectory: (name: string) => void;
    setName: (name: string) => void;
    setOriginalCopy: (name: string) => void;
  }
] => {
  const [gameCreationData, setGameCreationData] = useRecoilState(
    gameCreationDataState
  );

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
