import * as TauriDialog from "@tauri-apps/api/dialog";
import * as TauriPath from "@tauri-apps/api/path";
import { useCallback, useMemo } from "react";
import TextEditor from "./TextEditor";
import Button from "./Button";

type PathBrowserProps = {
  className?: string;
  isDisabled?: boolean;
  mode: "file" | "directory";
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function PathBrowser({
  className,
  isDisabled,
  mode,
  onBlur,
  onChange,
  placeholder,
  value,
}: PathBrowserProps) {
  const handleBrowse = useCallback(async () => {
    const path = await TauriDialog.open({
      defaultPath: await TauriPath.appDataDir(),
      directory: mode === "directory",
    });

    if (typeof path === "string") onChange(path);
  }, []);

  const extendedClassName = useMemo(() => {
    const baseClassName = "row";
    return className ? baseClassName + " " + className : baseClassName;
  }, [className]);

  return (
    <div className={extendedClassName}>
      <TextEditor
        className="flex-1"
        isDisabled={isDisabled}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
      <Button onClick={handleBrowse} text="..." isDisabled={isDisabled} />
    </div>
  );
}

export default PathBrowser;
