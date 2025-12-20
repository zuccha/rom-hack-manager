import { Flex } from "@chakra-ui/react";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { SearchIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import Section from "../../components/Section";
import TextEditor from "../../components/TextEditor";
import useFormValue from "../../hooks/useFormValue";
import useIsValid from "../../hooks/useIsValid";
import useListenEvent from "../../hooks/useListenEvent";
import useTauriInvoke from "../../hooks/useTauriInvoke";
import { useGame } from "../../store/game";
import { useGameDownloadData } from "../../store/game-download-data";
import { useGlobalSettings } from "../../store/global-settings";
import { SelectHackPayloadSchema } from "../events";
import {
  validateDirectoryPath,
  validateFilePath,
  validateName,
  validateHackDownloadSource,
  validateHackNameOrEmpty,
} from "../validation";

type SectionHackDownloadProps = {
  gameId: string;
};

const sanitizeHackName = (name: string): string => {
  return name
    .replace(/"/g, "")
    .replace(/\*/g, "")
    .replace(/\//g, "")
    .replace(/:\S/g, "-")
    .replace(/:/g, " -")
    .replace(/</g, "")
    .replace(/>/g, "")
    .replace(/\?/g, "")
    .replace(/\\/g, "")
    .replace(/\|/g, "");
};

function SectionHackDownload({ gameId }: SectionHackDownloadProps) {
  const [globalSettings] = useGlobalSettings();
  const [game] = useGame(gameId);
  const [gameDownloadData, gameDownloadDataMethods] =
    useGameDownloadData(gameId);

  const hackName = useFormValue(gameId, gameDownloadData.name, {
    isDirty: gameDownloadData.name !== "",
    onChange: gameDownloadDataMethods.setName,
    validate: validateHackNameOrEmpty,
  });

  const hackDownloadUrl = useFormValue(gameId, gameDownloadData.downloadUrl, {
    isDirty: gameDownloadData.downloadUrl !== "",
    onChange: gameDownloadDataMethods.setDownloadUrl,
    validate: validateHackDownloadSource,
  });

  const handleHackNameChangeValue = hackName.handleChangeValue;
  const handleHackDownloadUrlChangeValue = hackDownloadUrl.handleChangeValue;

  useListenEvent(
    "select-hack",
    useCallback(
      (maybePayload) => {
        try {
          const payload = SelectHackPayloadSchema.parse(maybePayload);
          if (payload.gameId !== gameId) return;
          handleHackNameChangeValue(sanitizeHackName(payload.name));
          handleHackDownloadUrlChangeValue(payload.downloadUrl);
        } catch (e) {
          console.error(e);
          // TODO: Set generic error.
        }
      },
      [gameId, handleHackNameChangeValue, handleHackDownloadUrlChangeValue]
    )
  );

  const globalSettingsCookie = globalSettings.cookie;
  const globalSettingsOpenHackFolderAfterDownload =
    globalSettings.openHackFolderAfterDownload;
  const gameDirectory = game.directory;
  const gameOriginalCopy = game.originalCopy;
  const hackDownloadUrlValue = hackDownloadUrl.value;
  const hackNameValue = hackName.value;

  const downloadArgs = useMemo(
    () => ({
      cookie: globalSettingsCookie,
      gameDirectory: gameDirectory,
      gameOriginalCopy: gameOriginalCopy,
      hackDownloadUrl: hackDownloadUrlValue,
      hackName: hackNameValue,
      openHackFolderAfterDownload: globalSettingsOpenHackFolderAfterDownload,
    }),
    [
      globalSettingsCookie,
      gameDirectory,
      gameOriginalCopy,
      hackDownloadUrlValue,
      hackNameValue,
      globalSettingsOpenHackFolderAfterDownload,
    ]
  );

  const [downloadHack, isDownloading, error] = useTauriInvoke(
    "download_hack",
    downloadArgs
  );

  const isGameDirectoryValid = useIsValid(
    game.directory,
    validateDirectoryPath
  );

  const isGameOriginalCopyValid = useIsValid(
    game.originalCopy,
    validateFilePath
  );

  const isValid =
    isGameDirectoryValid &&
    isGameOriginalCopyValid &&
    hackName.isValid &&
    hackDownloadUrl.isValid;

  const downloadHackIfIsValid = useCallback(() => {
    if (isValid) downloadHack();
  }, [downloadHack, isValid]);

  const openSearchWindow = useCallback(() => {
    new WebviewWindow(`search-${gameId}`, {
      alwaysOnTop: globalSettings.keepSearchWindowOnTop,
      fullscreen: false,
      height: 600,
      resizable: true,
      title: `Search (${game.name})`,
      url: "src/windows/search/Search.html",
      useHttpsScheme: true,
      width: 550,
    });
  }, [game.name, gameId, globalSettings.keepSearchWindowOnTop]);

  return (
    <Section isDefaultExpanded title="Add hack">
      <Flex direction="column" gap={3}>
        <TextEditor
          autoFocus
          error={hackName.errorIfDirty}
          isDisabled={isDownloading}
          onBlur={hackName.handleBlur}
          onChange={hackName.handleChangeValue}
          onSubmit={downloadHackIfIsValid}
          placeholder="Hack Name"
          value={hackName.value}
        />
        <TextEditor
          error={hackDownloadUrl.errorIfDirty}
          isDisabled={isDownloading}
          onBlur={hackDownloadUrl.handleBlur}
          onChange={hackDownloadUrl.handleChangeValue}
          onSubmit={downloadHackIfIsValid}
          placeholder="Hack Download URL or local .zip path"
          value={hackDownloadUrl.value}
        />
        <Flex gap={3}>
          <Button
            isDisabled={isDownloading}
            isFullWidth
            leftIcon={<SearchIcon />}
            onClick={openSearchWindow}
            text="Search on SMWCentral"
            variant="outline"
          />

          <Button
            isDisabled={!isValid || isDownloading}
            isFullWidth
            isLoading={isDownloading}
            onClick={downloadHackIfIsValid}
            text="Download"
          />
        </Flex>
        {error && <Alert description={error} status="error" />}
      </Flex>
    </Section>
  );
}

export default SectionHackDownload;
