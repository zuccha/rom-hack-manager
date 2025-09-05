"use client";

import { ChakraProvider, ClientOnly, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider as NextThemesThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { useGlobalSettings } from "../windows/store";

export type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [globalSettings] = useGlobalSettings();

  return (
    <ChakraProvider value={defaultSystem}>
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
