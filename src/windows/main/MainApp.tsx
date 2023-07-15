import { useEffect, useState } from "react";
import MainAppForm from "./MainAppForm";
import { Store, readStore } from "../../hooks/useStore";

function MainApp() {
  const [store, setStore] = useState<Store | undefined>(undefined);

  useEffect(() => {
    readStore().then(setStore);
  }, []);

  if (!store) {
    return null;
  }

  return (
    <MainAppForm
      defaultDirectoryPath={store.directoryPath}
      defaultVanillaROMPath={store.vanillaROMPath}
    />
  );
}

export default MainApp;
