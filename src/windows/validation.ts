import { invoke } from "@tauri-apps/api/tauri";

export const validateNotEmpty = (str: string): string | undefined => {
  return str === "" ? "Value cannot be empty" : undefined;
};

export const validateDirectoryPath = async (
  directoryPath: string
): Promise<string | undefined> => {
  return invoke("validate_directory_path", { path: directoryPath })
    .then(() => undefined)
    .catch((e) => e);
};

export const validateFilePath = async (
  filePath: string
): Promise<string | undefined> => {
  return invoke("validate_file_path", { path: filePath })
    .then(() => undefined)
    .catch((e) => e);
};

export const validateName = async (
  name: string
): Promise<string | undefined> => {
  return invoke("validate_name", { name })
    .then(() => undefined)
    .catch((e) => e);
};

export const validateURL = async (url: string): Promise<string | undefined> => {
  return invoke("validate_url", { url })
    .then(() => undefined)
    .catch((e) => e);
};
