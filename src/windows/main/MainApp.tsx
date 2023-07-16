import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Store, readStore } from "../../hooks/useStore";
import MainAppForm from "./MainAppForm";
import Container from "../../components/Container";
import Website from "../../components/Website";

function MainApp() {
  const [store, setStore] = useState<Store | undefined>(undefined);

  useEffect(() => {
    readStore().then(setStore);
  }, []);

  if (!store) {
    return null;
  }

  return (
    <Container justifyContent="space-between">
      <MainAppForm
        defaultDirectoryPath={store.directoryPath}
        defaultVanillaROMPath={store.vanillaROMPath}
      />
      <Flex>
        <Website
          href="https://github.com/zuccha/rom-hack-downloader"
          label="Documentation"
        />
      </Flex>
    </Container>
  );
}

export default MainApp;
