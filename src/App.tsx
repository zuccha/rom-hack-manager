import { useState } from "react";
import Button from "./components/Button";
import PathBrowser from "./components/PathBrowser";
import TextEditor from "./components/TextEditor";

function App() {
  const [hackURL, setHackURL] = useState("");
  const [hackDirectory, setHackDirectory] = useState("");
  const [vanillaFile, setVanillaFile] = useState("");

  const isValid = hackURL !== "" && hackDirectory !== "" && vanillaFile !== "";

  return (
    <div className="column" style={styles.container}>
      <TextEditor
        onChange={setHackURL}
        placeholder="Download URL"
        value={hackURL}
      />

      <PathBrowser
        mode="directory"
        onChange={setHackDirectory}
        placeholder="Directory"
        value={hackDirectory}
      />

      <PathBrowser
        mode="file"
        onChange={setVanillaFile}
        placeholder="Vanilla File"
        value={vanillaFile}
      />

      <Button isDisabled={!isValid} onClick={() => {}} text="Download" />

      <span className="text-danger">An error occurred</span>
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
