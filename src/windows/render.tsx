import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import useTheme from "../hooks/useTheme";

const styles = {
  global: {
    ":not(.chakra-dont-set-collapse) > .chakra-collapse": {
      overflow: "initial !important",
    },
  },
};

const chakraTheme = extendTheme({ styles });

function BorderWrapper({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <Box borderTopColor="gray.300" borderTopWidth={theme === "light" ? 1 : 0}>
      {children}
    </Box>
  );
}

const render = (root: React.ReactNode) => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <RecoilRoot>
        <ChakraProvider theme={chakraTheme}>
          <BorderWrapper>{root}</BorderWrapper>
        </ChakraProvider>
      </RecoilRoot>
    </React.StrictMode>
  );
};

export default render;
