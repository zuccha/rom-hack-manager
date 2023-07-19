import { Box, ChakraProvider, Flex, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";

const styles = {
  global: {
    ":not(.chakra-dont-set-collapse) > .chakra-collapse": {
      overflow: "initial !important",
    },
  },
};

const theme = extendTheme({ styles });

const render = (root: React.ReactNode) => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Box borderTopColor="gray.300" borderTopWidth={1}>
            {root}
          </Box>
        </ChakraProvider>
      </RecoilRoot>
    </React.StrictMode>
  );
};

export default render;
