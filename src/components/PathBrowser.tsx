import * as TauriDialog from "@tauri-apps/api/dialog";
import * as TauriPath from "@tauri-apps/api/path";
import * as Tauri from "@tauri-apps/api/tauri";
import { useCallback, useMemo } from "react";
import TextEditor from "./TextEditor";
import Button from "./Button";

type PathBrowserProps = {
  className?: string;
  error?: string;
  isDisabled?: boolean;
  isFullWidth?: boolean;
  mode: "file" | "directory";
  onBlur?: () => void;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder: string;
  value: string;
};

function PathBrowser({
  className,
  error,
  isDisabled,
  isFullWidth,
  mode,
  onBlur,
  onChange,
  onSubmit,
  placeholder,
  value,
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

  const extendedClassName = useMemo(() => {
    const baseClassName = "row";
    return className ? baseClassName + " " + className : baseClassName;
  }, [className]);

  return (
    <div className={extendedClassName}>
      <TextEditor
        error={error}
        isDisabled={isDisabled}
        isFullWidth={isFullWidth}
        onBlur={onBlur}
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder={placeholder}
        value={value}
      />

      <div className="h-spacer" />

      <Button onClick={handleBrowse} text="..." isDisabled={isDisabled} />
    </div>
  );
}

export default PathBrowser;
