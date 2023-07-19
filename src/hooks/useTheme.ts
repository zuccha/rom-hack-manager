import { appWindow, Theme } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

const useTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    appWindow.theme().then((newTheme) => {
      setTheme(newTheme ?? "light");
    });
  }, []);

  useEffect(() => {
    const themeChangedRef = { unlisten: () => {} };

    const listenThemeChanged = async () => {
      themeChangedRef.unlisten = await appWindow.onThemeChanged((event) =>
        setTheme(event.payload)
      );
    };

    listenThemeChanged();

    return () => themeChangedRef.unlisten();
  });

  return theme;
};

export default useTheme;
