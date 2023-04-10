import * as TauriFS from "@tauri-apps/api/fs";
import * as TauriPath from "@tauri-apps/api/path";

export type Store = {
  directoryPath: string;
  vanillaROMPath: string;
};

const defaultStore: Store = {
  directoryPath: "",
  vanillaROMPath: "",
};

const storeName = "settings.json";

const isStore = (maybeStore: unknown): maybeStore is Store => {
  return (
    typeof maybeStore === "object" &&
    maybeStore !== null &&
    "directoryPath" in maybeStore &&
    typeof maybeStore.directoryPath === "string" &&
    "vanillaROMPath" in maybeStore &&
    typeof maybeStore.vanillaROMPath === "string"
  );
};

export const readStore = async (): Promise<Store | undefined> => {
  try {
    const dataDirPath = await TauriPath.appDataDir();
    const storePath = await TauriPath.join(dataDirPath, storeName);

    const storeExists = await TauriFS.exists(storePath);
    if (!storeExists) return defaultStore;

    const maybeStore = JSON.parse(await TauriFS.readTextFile(storePath));
    if (!isStore(maybeStore)) return defaultStore;

    return maybeStore;
  } catch (e) {
    console.log(e);
    return defaultStore;
  }
};

export const writeStore = async (store: Store): Promise<void> => {
  try {
    const dataDirPath = await TauriPath.appDataDir();
    const storePath = await TauriPath.join(dataDirPath, storeName);

    if (!(await TauriFS.exists(dataDirPath)))
      await TauriFS.createDir(dataDirPath, { recursive: true });
    await TauriFS.writeTextFile(storePath, JSON.stringify(store));
  } catch (e) {
    console.log(e);
    // Ignore.
  }
};
