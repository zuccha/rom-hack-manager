import { useState } from "react";
import Button from "./components/Button";
import PathBrowser from "./components/PathBrowser";
import TextEditor from "./components/TextEditor";
import useDownloadHack from "./hooks/useDownloadHack";

function App() {
  const [hackURL, setHackURL] = useState("");
  const [hackDirectory, setHackDirectory] = useState("");
  const [vanillaFile, setVanillaFile] = useState("");

  const { download, error, status } = useDownloadHack({
    directoryPath: hackDirectory,
    url: hackURL,
    vanillaFilePath: vanillaFile,
  });

  const isValid = hackURL !== "" && hackDirectory !== "" && vanillaFile !== "";

  return (
    <div className="column" style={styles.container}>
      <TextEditor
        isDisabled={status === "loading"}
        onChange={setHackURL}
        placeholder="Download URL"
        value={hackURL}
      />

      <PathBrowser
        isDisabled={status === "loading"}
        mode="directory"
        onChange={setHackDirectory}
        placeholder="Directory"
        value={hackDirectory}
      />

      <PathBrowser
        isDisabled={status === "loading"}
        mode="file"
        onChange={setVanillaFile}
        placeholder="Vanilla File"
        value={vanillaFile}
      />

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
