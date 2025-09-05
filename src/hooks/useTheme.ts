import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";

const appWindow = getCurrentWebviewWindow();

type Theme = "light" | "dark";

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
