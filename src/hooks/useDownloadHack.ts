import * as TauriFS from "@tauri-apps/api/fs";
import { useCallback, useMemo, useState } from "react";

export type Status = "initial" | "loading" | "failure" | "success";

const useDownloadHack = ({
  directoryPath,
  url,
  vanillaFilePath,
}: {
  directoryPath: string;
  url: string;
  vanillaFilePath: string;
}) => {
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("initial");

  const download = useCallback(async () => {
    setError("");
    setStatus("loading");

    const directoryExists = await TauriFS.exists(directoryPath).catch(
      () => false
    );
    if (!directoryExists) {
      setError("Target directory does not exist");
      setStatus("failure");
      return;
    }

    const vanillaFileExists = await TauriFS.exists(vanillaFilePath).catch(
      () => false
    );
    if (!vanillaFileExists) {
      setError("Vanilla ROM does not exist");
      setStatus("failure");
      return;
    }

    const urlIsValid = url !== "";
    if (!urlIsValid) {
      setError("The download URL is not valid");
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
