import { WebviewWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
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
    <div className="container column">
      <div className="row justify-space-between">
        <div className="header">
          <span>Download a hack</span>
        </div>
        <div>
          <Button
            isDisabled={status === "loading"}
            onClick={() => {
              const searchWindow = WebviewWindow.getByLabel("search");
              searchWindow?.show();
            }}
            text="Search →"
          />
        </div>
      </div>

      <TextEditor
        error={name.isPristine ? undefined : name.error}
        isDisabled={status === "loading"}
        isFullWidth
        onBlur={name.handleBlur}
        onChange={name.handleChangeValue}
        placeholder="Hack name"
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
        placeholder="Directory"
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
        placeholder="Vanilla File"
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

      <div className="row footer">
        <div className="row">
          <a
            href="https://github.com/zuccha/rom-hack-downloader"
            target="_blank"
          >
            Documentation
          </a>
          &nbsp;{" | "}&nbsp;
          <a
            href="https://github.com/zuccha/rom-hack-downloader"
            target="_blank"
          >
            SMW Hacks
          </a>
          &nbsp;{" | "}&nbsp;
          <a
            href="https://github.com/zuccha/rom-hack-downloader"
            target="_blank"
          >
            Yoshi Island Hacks
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainAppForm;
