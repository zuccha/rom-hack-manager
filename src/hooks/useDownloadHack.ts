import * as TauriFS from "@tauri-apps/api/fs";
import * as TauriHTTP from "@tauri-apps/api/http";
import * as TauriPath from "@tauri-apps/api/path";
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

export const validateName = async (
  url: string
): Promise<string | undefined> => {
  if (url === "") return "No hack name has been specified";
  return undefined;
};

const useDownloadHack = ({
  directoryPath,
  name,
  url,
  vanillaFilePath,
}: {
  directoryPath: string;
  name: string;
  url: string;
  vanillaFilePath: string;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<Status>("initial");

  const download = useCallback(async () => {
    const fail = (e: string) => {
      setError(e);
      setStatus("failure");
    };

    setError(undefined);
    setStatus("loading");
    let error: string | undefined;

    error = await validateDirectoryPath(directoryPath);
    if (error !== undefined) {
      fail(error);
      return;
    }

    error = await validateVanillaFilePath(vanillaFilePath);
    if (error !== undefined) {
      fail(error);
      return;
    }

    error = await validateURL(url);
    if (error !== undefined) {
      fail(error);
      return;
    }

    // & Download zip
    let contents: TauriFS.BinaryFileContents;
    try {
      contents = (
        await TauriHTTP.fetch(url, {
          method: "GET",
          responseType: TauriHTTP.ResponseType.Binary,
        })
      ).data as TauriFS.BinaryFileContents;
    } catch {
      fail("Failed to download zip file");
      return;
    }

    // & Write zip
    const zipFilePath = await TauriPath.join(directoryPath, name + ".zip");
    try {
      await TauriFS.writeBinaryFile({
        contents,
        path: zipFilePath,
      });
    } catch (e) {
      fail("Failed to write zip file");
      return;
    }

    // TODO: Unzip.
    // TODO: Remove zip.
    // TODO: Patch files.

    setStatus("success");
  }, [directoryPath, url, vanillaFilePath]);

  return { download, error, status };
};

export default useDownloadHack;
