"use client";

import {
  ChakraProvider,
  ClientOnly,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";
import { ThemeProvider as NextThemesThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { useGlobalSettings } from "../windows/store";

const config = defineConfig({
  globalCss: {
    "html, body, #root": {
      bg: "bg.subtle",
    },
  },
});

const system = createSystem(defaultConfig, config);

export type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [globalSettings] = useGlobalSettings();

  return (
    <ChakraProvider value={system}>
      <NextThemesThemeProvider
        attribute="class"
        disableTransitionOnChange
        forcedTheme={globalSettings.theme}
      >
        <ClientOnly>{children}</ClientOnly>
      </NextThemesThemeProvider>
    </ChakraProvider>
  );
}
