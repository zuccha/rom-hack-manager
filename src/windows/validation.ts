import { invoke } from "@tauri-apps/api/core";

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

export const validateHackDownloadSource = async (
  value: string
): Promise<string | undefined> => {
  const trimmed = value.trim();

  if (trimmed === "") {
    return "Value cannot be empty";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return validateURL(trimmed);
  }

  return validateFilePath(trimmed);
};

export const validateHackNameOrEmpty = async (
  name: string
): Promise<string | undefined> => {
  if (name.trim() === "") {
    return undefined;
  }

  return validateName(name);
};
