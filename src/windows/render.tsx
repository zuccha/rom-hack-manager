import { Box } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "../components/ThemeProvider";
import { useGlobalSettings } from "../store/global-settings";

function BorderWrapper({ children }: { children: React.ReactNode }) {
  const [globalSettings] = useGlobalSettings();

  return (
    <Box borderTopWidth={globalSettings.theme === "light" ? 1 : 0}>
      {children}
    </Box>
  );
}

const render = (root: React.ReactNode) => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <BorderWrapper>{root}</BorderWrapper>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default render;
