import { SearchIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useCallback, useMemo } from "react";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import Section from "../../components/Section";
import TextEditor from "../../components/TextEditor";
import useFormValue from "../../hooks/useFormValue";
import useIsValid from "../../hooks/useIsValid";
import useListenEvent from "../../hooks/useListenEvent";
import useTauriInvoke from "../../hooks/useTauriInvoke";
import { useGame } from "../store";
import {
  validateDirectoryPath,
  validateFilePath,
  validateName,
  validateURL,
} from "../validation";
import { SelectHackPayloadSchema } from "../events";

type SectionHackDownloadProps = {
  gameId: string;
};

function SectionHackDownload({ gameId }: SectionHackDownloadProps) {
  const [game] = useGame(gameId);

  const hackName = useFormValue<string>("", { validate: validateName });
  const hackDownloadUrl = useFormValue<string>("", { validate: validateURL });

  useListenEvent(
    useCallback(
      (maybePayload) => {
        try {
          console.log(maybePayload);
          const payload = SelectHackPayloadSchema.parse(maybePayload);
          if (payload.gameId !== gameId) return;
          hackName.handleChangeValue(payload.name);
          hackDownloadUrl.handleChangeValue(payload.downloadUrl);
        } catch (e) {
          console.log(e);
          // TODO: Set generic error.
        }
      },
      [gameId, hackName.handleChangeValue, hackDownloadUrl.handleChangeValue]
    )
  );

  const downloadArgs = useMemo(
    () => ({
      gameDirectory: game.directory,
      gameOriginalCopy: game.originalCopy,
      hackName: hackName.value,
      hackDownloadUrl: hackDownloadUrl.value,
    }),
    [game.directory, game.originalCopy, hackName.value, hackDownloadUrl.value]
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
      alwaysOnTop: true,
      fullscreen: false,
      resizable: true,
      title: `Search (${game.name})`,
      width: 550,
      height: 600,
      url: "src/windows/search/Search.html",
    });
  }, []);

  return (
    <Section isDefaultExpanded title="Add hack">
      <Flex direction="column" gap={3}>
        <Button
          isDisabled={isDownloading}
          leftIcon={<SearchIcon />}
          onClick={openSearchWindow}
          text="Search on SMWCentral"
          variant="outline"
        />
        <TextEditor
          autoFocus
          error={hackName.isPristine ? undefined : hackName.error}
          isDisabled={isDownloading}
          onBlur={hackName.handleBlur}
          onChange={hackName.handleChangeValue}
          onSubmit={downloadHackIfIsValid}
          placeholder="Hack Name"
          value={hackName.value}
        />
        <TextEditor
          error={hackDownloadUrl.isPristine ? undefined : hackDownloadUrl.error}
          isDisabled={isDownloading}
          onBlur={hackDownloadUrl.handleBlur}
          onChange={hackDownloadUrl.handleChangeValue}
          onSubmit={downloadHackIfIsValid}
          placeholder="Hack Download URL"
          value={hackDownloadUrl.value}
        />
        <Button
          isDisabled={!isValid || isDownloading}
          isLoading={isDownloading}
          onClick={downloadHackIfIsValid}
          text="Download"
        />
        {error && <Alert status="error" description={error} />}
      </Flex>
    </Section>
  );
}

export default SectionHackDownload;
