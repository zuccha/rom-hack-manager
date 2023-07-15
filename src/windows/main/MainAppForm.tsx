import { WebviewWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect } from "react";
import Button from "../../components/Button";
import PathBrowser from "../../components/PathBrowser";
import TextEditor from "../../components/TextEditor";
import useDownloadHack, {
  validateDirectoryPath,
  validateName,
  validateURL,
  validateVanillaROMPath,
} from "../../hooks/useDownloadHack";
import useFormValue from "../../hooks/useFormValue";
import { writeStore } from "../../hooks/useStore";

type MainAppFormProps = {
  defaultDirectoryPath: string;
  defaultVanillaROMPath: string;
};

const openSearchWindow = () => {
  new WebviewWindow("search", {
    alwaysOnTop: true,
    fullscreen: false,
    resizable: true,
    title: "Search",
    width: 500,
    height: 400,
    url: "src/windows/search/Search.html",
  });
};

function MainAppForm({
  defaultDirectoryPath,
  defaultVanillaROMPath,
}: MainAppFormProps) {
  const name = useFormValue<string>("", { validate: validateName });
  const url = useFormValue<string>("", { validate: validateURL });
  const directoryPath = useFormValue(defaultDirectoryPath, {
    isDirty: defaultDirectoryPath !== "",
    validate: validateDirectoryPath,
  });
  const vanillaROMPath = useFormValue(defaultVanillaROMPath, {
    isDirty: defaultVanillaROMPath !== "",
    validate: validateVanillaROMPath,
  });

  const { download, error, status } = useDownloadHack({
    directoryPath: directoryPath.value,
    name: name.value,
    url: url.value,
    vanillaRomPath: vanillaROMPath.value,
  });

  useEffect(() => {
    writeStore({
      directoryPath: directoryPath.value,
      vanillaROMPath: vanillaROMPath.value,
    });
  }, [directoryPath.value, vanillaROMPath.value]);

  const isValid =
    url.isValid && directoryPath.isValid && vanillaROMPath.isValid;

  return (
    <div className="column">
      <div className="row justify-space-between">
        <div className="header">
          <span>Download a hack</span>
        </div>
        <div>
          <Button
            isDisabled={status === "loading"}
            onClick={openSearchWindow}
            text="Search →"
          />
        </div>
      </div>

      <TextEditor
        autoFocus
        error={name.isPristine ? undefined : name.error}
        isDisabled={status === "loading"}
        isFullWidth
        onBlur={name.handleBlur}
        onChange={name.handleChangeValue}
        placeholder="Name"
        value={name.value}
      />

      <div className="v-spacer" />

      <TextEditor
        error={url.isPristine ? undefined : url.error}
        isDisabled={status === "loading"}
        isFullWidth
        onBlur={url.handleBlur}
        onChange={url.handleChangeValue}
        placeholder="Download URL"
        value={url.value}
      />

      <div className="v-spacer" />

      <PathBrowser
        error={directoryPath.isPristine ? undefined : directoryPath.error}
        isDisabled={status === "loading"}
        isFullWidth
        mode="directory"
        onBlur={directoryPath.handleBlur}
        onChange={directoryPath.handleChangeValue}
        placeholder="Folder"
        value={directoryPath.value}
      />

      <div className="v-spacer" />

      <PathBrowser
        error={vanillaROMPath.isPristine ? undefined : vanillaROMPath.error}
        isDisabled={status === "loading"}
        isFullWidth
        mode="file"
        onBlur={vanillaROMPath.handleBlur}
        onChange={vanillaROMPath.handleChangeValue}
        placeholder="Original File"
        value={vanillaROMPath.value}
      />

      <div className="v-spacer" />

      <Button
        className="flex-1"
        isDisabled={!isValid || status === "loading"}
        onClick={download}
        text="Download"
      />

      <div className="v-spacer" />

      <span className="text-danger">{error ?? "\u00a0"}</span>
    </div>
  );
}

export default MainAppForm;
