import Button from "./components/Button";
import PathBrowser from "./components/PathBrowser";
import TextEditor from "./components/TextEditor";
import useDownloadHack, {
  validateDirectoryPath,
  validateName,
  validateURL,
  validateVanillaROMPath,
} from "./hooks/useDownloadHack";
import useFormValue from "./hooks/useFormValue";
import FormValueControl from "./components/FormValueControl";
import { useEffect } from "react";
import { writeStore } from "./hooks/useStore";

type AppFormProps = {
  defaultDirectoryPath: string;
  defaultVanillaROMPath: string;
};

function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  ms: number
) {
  let id: NodeJS.Timeout;
  return (...args: Args) => {
    clearTimeout(id);
    id = setTimeout(() => callback(...args), ms);
  };
}

const writeStoreDebounced = debounce(writeStore, 1000);

function AppForm({
  defaultDirectoryPath,
  defaultVanillaROMPath,
}: AppFormProps) {
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
    <div className="column" style={styles.container}>
      <div className="header">
        <span>ROM Hack Downloader</span>
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
        {/* <span>by zuccha</span> */}
      </div>
    </div>
  );
}

export default AppForm;

const styles = {
  container: {
    margin: "auto",
    padding: "1em",
    width: "500px",
    maxWidth: "600px",
  },
};
