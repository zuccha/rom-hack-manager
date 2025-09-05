import z from "zod";
import { useCallback } from "react";
import { createLocalStore } from "../utils/local-store";

export const globalSettingsSchema = z.object({
  askForConfirmationBeforeDeletingHack: z.boolean().default(true),
  askForConfirmationBeforeRemovingGame: z.boolean().default(true),
  openHackFolderAfterDownload: z.boolean().default(false),
  keepSearchWindowOnTop: z.boolean().default(true),
  cookie: z.string().default(""),
  emulatorPath: z.string().default(""),
  emulatorArgs: z.string().default("%1"),
  theme: z.enum(["light", "dark"]).default("light"),
});

export type GlobalSettings = z.infer<typeof globalSettingsSchema>;

export const globalSettingsStore = createLocalStore(
  "GlobalSettings",
  globalSettingsSchema.parse({}),
  globalSettingsSchema.parse
);

export const useGlobalSettings = (): [
  GlobalSettings,
  {
    setAskForConfirmationBeforeDeletingHack: (value: boolean) => void;
    setAskForConfirmationBeforeRemovingGame: (value: boolean) => void;
    setOpenHackFolderAfterDownload: (value: boolean) => void;
    setKeepSearchWindowOnTop: (value: boolean) => void;
    setCookie: (value: string) => void;
    setEmulatorPath: (value: string) => void;
    setEmulatorArgs: (value: string) => void;
    setTheme: (value: "light" | "dark") => void;
  }
] => {
  const [globalSettings, setGlobalSettings] = globalSettingsStore.use();

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

  const setKeepSearchWindowOnTop = useCallback(
    (keepSearchWindowOnTop: boolean) =>
      setGlobalSettings((oldGlobalSettings) => ({
        ...oldGlobalSettings,
        keepSearchWindowOnTop,
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

  const setTheme = useCallback(
    (theme: "light" | "dark") =>
      setGlobalSettings((oldGlobalSettings) => ({
        ...oldGlobalSettings,
        theme,
      })),
    [setGlobalSettings]
  );

  return [
    globalSettings,
    {
      setAskForConfirmationBeforeDeletingHack,
      setAskForConfirmationBeforeRemovingGame,
      setOpenHackFolderAfterDownload,
      setKeepSearchWindowOnTop,
      setCookie,
      setEmulatorPath,
      setEmulatorArgs,
      setTheme,
    },
  ];
};
