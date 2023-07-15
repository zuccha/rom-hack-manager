import * as Tauri from "@tauri-apps/api/tauri";
import { useCallback, useState } from "react";

export type Status = "initial" | "loading" | "failure" | "success";

export const validateDirectoryPath = async (
  directoryPath: string
): Promise<string | undefined> => {
  return Tauri.invoke("validate_directory_path", { path: directoryPath })
    .then(() => undefined)
    .catch((e) => e);
};

export const validateVanillaROMPath = async (
  vanillaRomPath: string
): Promise<string | undefined> => {
  return Tauri.invoke("validate_vanilla_rom_path", { path: vanillaRomPath })
    .then(() => undefined)
    .catch((e) => e);
};

export const validateURL = async (url: string): Promise<string | undefined> => {
  return Tauri.invoke("validate_url", { url })
    .then(() => undefined)
    .catch((e) => e);
};

export const validateName = async (
  name: string
): Promise<string | undefined> => {
  return Tauri.invoke("validate_name", { name })
    .then(() => undefined)
    .catch((e) => e);
};

const useDownloadHack = ({
  directoryPath,
  name,
  url,
  vanillaRomPath,
}: {
  directoryPath: string;
  name: string;
  url: string;
  vanillaRomPath: string;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<Status>("initial");

  const load = useCallback(() => {
    setError(undefined);
    setStatus("loading");
  }, []);

  const fail = useCallback((newError: string) => {
    setError(newError);
    setStatus("failure");
  }, []);

  const succeed = useCallback(() => {
    setError(undefined);
    setStatus("success");
  }, []);

  const download = useCallback(() => {
    if (status === "loading") return;

    load();

    Tauri.invoke("download_hack", { directoryPath, name, url, vanillaRomPath })
      .then(succeed)
      .catch(fail);
  }, [directoryPath, fail, load, status, succeed, url, vanillaRomPath]);

  return { download, error, status };
};

export default useDownloadHack;
