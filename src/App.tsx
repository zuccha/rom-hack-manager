import { useEffect, useState } from "react";
import { Store, readStore } from "./hooks/useStore";
import AppForm from "./AppForm";

function App() {
  const [store, setStore] = useState<Store | undefined>(undefined);

  useEffect(() => {
    readStore().then(setStore);
  }, []);

  return store ? (
    <AppForm
      defaultDirectoryPath={store.directoryPath}
      defaultVanillaROMPath={store.vanillaROMPath}
    />
  ) : null;
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
