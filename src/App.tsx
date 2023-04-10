import Button from "./components/Button";
import PathBrowser from "./components/PathBrowser";
import TextEditor from "./components/TextEditor";
import useDownloadHack, {
  validateDirectoryPath,
  validateURL,
  validateVanillaFilePath,
} from "./hooks/useDownloadHack";
import useFormValue from "./hooks/useFormValue";
import FormValueControl from "./components/FormValueControl";

function App() {
  const url = useFormValue<string>("", validateURL);
  const directoryPath = useFormValue<string>("", validateDirectoryPath);
  const vanillaFilePath = useFormValue<string>("", validateVanillaFilePath);

  const { download, error, status } = useDownloadHack({
    directoryPath: directoryPath.value,
    url: url.value,
    vanillaFilePath: vanillaFilePath.value,
  });

  const isValid =
    url.isValid && directoryPath.isValid && vanillaFilePath.isValid;

  return (
    <div className="column" style={styles.container}>
      <FormValueControl value={url}>
        <TextEditor
          isDisabled={status === "loading"}
          onBlur={url.handleBlur}
          onChange={url.handleChangeValue}
          placeholder="Download URL"
          value={url.value}
        />
      </FormValueControl>

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

      <FormValueControl value={vanillaFilePath}>
        <PathBrowser
          isDisabled={status === "loading"}
          mode="file"
          onBlur={vanillaFilePath.handleBlur}
          onChange={vanillaFilePath.handleChangeValue}
          placeholder="Vanilla File"
          value={vanillaFilePath.value}
        />
      </FormValueControl>

      <Button
        isDisabled={!isValid || status === "loading"}
        onClick={download}
        text="Download"
      />

      {status === "failure" && <span className="text-danger">{error}</span>}
    </div>
  );
}

export default App;

const styles = {
  container: {
    margin: "auto",
    padding: "1em",
    width: "500px",
    maxWidth: "600px",
  },
};
