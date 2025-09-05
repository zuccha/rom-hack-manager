import { Flex } from "@chakra-ui/react";
import * as Tauri from "@tauri-apps/api/core";
import * as TauriDialog from "@tauri-apps/plugin-dialog";
import * as TauriPath from "@tauri-apps/api/path";
import { useCallback } from "react";
import Button from "./Button";
import TextEditor, { TextEditorProps } from "./TextEditor";

type PathBrowserProps = TextEditorProps & {
  mode: "file" | "directory";
};

function PathBrowser({
  isDisabled,
  mode,
  onChange,
  value,
  ...props
}: PathBrowserProps) {
  const handleBrowse = useCallback(async () => {
    const defaultPath = (await Tauri.invoke("path_exists", { path: value }))
      ? value
      : await TauriPath.downloadDir();

    const path = await TauriDialog.open({
      defaultPath,
      directory: mode === "directory",
    });

    if (typeof path === "string") onChange(path);
  }, [value]);

  return (
    <Flex gap={1}>
      <TextEditor
        isDisabled={isDisabled}
        onChange={onChange}
        value={value}
        {...props}
      />

      <Button isDisabled={isDisabled} onClick={handleBrowse} text="..." />
    </Flex>
  );
}

export default PathBrowser;
