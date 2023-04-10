import * as TauriFS from "@tauri-apps/api/fs";
import { useCallback, useState } from "react";

export type Status = "initial" | "loading" | "failure" | "success";

export const validateDirectoryPath = async (
  directoryPath: string
): Promise<string | undefined> => {
  if (directoryPath === "") return "No directory has been specified";
  try {
    const directoryExists = await TauriFS.exists(directoryPath);
    return directoryExists ? undefined : "Directory does not exist";
  } catch {
    return "Directory does not exist";
  }
};

export const validateVanillaFilePath = async (
  vanillaFilePath: string
): Promise<string | undefined> => {
  if (vanillaFilePath === "") return "No Vanilla ROM has been specified";
  try {
    const vanillaFileExists = await TauriFS.exists(vanillaFilePath);
    return vanillaFileExists ? undefined : "Vanilla ROM does not exist";
  } catch {
    return "Vanilla ROM does not exist";
  }
};

export const validateURL = async (url: string): Promise<string | undefined> => {
  if (url === "") return "No download URL has been specified";
  return undefined;
};

const useDownloadHack = ({
  directoryPath,
  url,
  vanillaFilePath,
}: {
  directoryPath: string;
  url: string;
  vanillaFilePath: string;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<Status>("initial");

  const download = useCallback(async () => {
    setError(undefined);
    setStatus("loading");
    let error: string | undefined;

    error = await validateDirectoryPath(directoryPath);
    if (error !== undefined) {
      setError(error);
      setStatus("failure");
      return;
    }

    error = await validateVanillaFilePath(vanillaFilePath);
    if (error !== undefined) {
      setError(error);
      setStatus("failure");
      return;
    }

    error = await validateURL(url);
    if (error !== undefined) {
      setError(error);
      setStatus("failure");
      return;
    }

    // TODO: Download zip.
    // TODO: Unzip.
    // TODO: Remove zip.
    // TODO: Patch files.

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("success");
  }, [directoryPath, url, vanillaFilePath]);

  return { download, error, status };
};

export default useDownloadHack;
