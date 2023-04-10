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
  const name = useFormValue<string>("", validateName);
  const url = useFormValue<string>("", validateURL);
  const directoryPath = useFormValue(
    defaultDirectoryPath,
    validateDirectoryPath
  );
  const vanillaROMPath = useFormValue(
    defaultVanillaROMPath,
    validateVanillaROMPath
  );

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
      <FormValueControl value={name}>
        <TextEditor
          isDisabled={status === "loading"}
          onBlur={name.handleBlur}
          onChange={name.handleChangeValue}
          placeholder="Hack name"
          value={name.value}
        />
      </FormValueControl>

      <div className="v-spacer" />

      <FormValueControl value={url}>
        <TextEditor
          isDisabled={status === "loading"}
          onBlur={url.handleBlur}
          onChange={url.handleChangeValue}
          placeholder="Download URL"
          value={url.value}
        />
      </FormValueControl>

      <div className="v-spacer" />

      <FormValueControl value={directoryPath}>
        <PathBrowser
          isDisabled={status === "loading"}
          mode="directory"
          onBlur={directoryPath.handleBlur}
          onChange={directoryPath.handleChangeValue}
          placeholder="Directory"
          value={directoryPath.value}
        />
      </FormValueControl>

      <div className="v-spacer" />

      <FormValueControl value={vanillaROMPath}>
        <PathBrowser
          isDisabled={status === "loading"}
          mode="file"
          onBlur={vanillaROMPath.handleBlur}
          onChange={vanillaROMPath.handleChangeValue}
          placeholder="Vanilla File"
          value={vanillaROMPath.value}
        />
      </FormValueControl>

      <div className="v-spacer" />

      <Button
        isDisabled={!isValid || status === "loading"}
        onClick={download}
        text="Download"
      />

      {status === "failure" && <span className="text-danger">{error}</span>}
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
