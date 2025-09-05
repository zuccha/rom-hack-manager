import { Box } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import useTheme from "../hooks/useTheme";
import { ThemeProvider } from "../components/ThemeProvider";

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
        <ThemeProvider>
          <BorderWrapper>{root}</BorderWrapper>
        </ThemeProvider>
      </RecoilRoot>
    </React.StrictMode>
  );
};

export default render;
