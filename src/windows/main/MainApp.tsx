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
    <div className="container column justify-space-between flex-1">
      <MainAppForm
        defaultDirectoryPath={store.directoryPath}
        defaultVanillaROMPath={store.vanillaROMPath}
      />
      <div className="row footer">
        <div className="row">
          <a
            href="https://github.com/zuccha/rom-hack-downloader"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainApp;
