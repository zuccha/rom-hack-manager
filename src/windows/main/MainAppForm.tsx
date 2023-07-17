import { SearchIcon } from "@chakra-ui/icons";
import { Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect } from "react";
import Button from "../../components/Button";
import PathBrowser from "../../components/PathBrowser";
import TextEditor from "../../components/TextEditor";
import useDownloadHack, {
  validateDirectoryPath,
  validateName,
  validateURL,
  validateVanillaROMPath,
} from "../../hooks/useDownloadHack";
import useFormValue from "../../hooks/useFormValue";
import { writeStore } from "../../hooks/useStore";
import { SelectHackPayloadSchema } from "../events";
import Alert from "../../components/Alert";
import Section from "../../components/Section";

type MainAppFormProps = {
  defaultDirectoryPath: string;
  defaultVanillaROMPath: string;
};

const openSearchWindow = () => {
  new WebviewWindow("search", {
    alwaysOnTop: true,
    fullscreen: false,
    resizable: true,
    title: "Search",
    width: 550,
    height: 600,
    url: "src/windows/search/Search.html",
  });
};

function MainAppForm({
  defaultDirectoryPath,
  defaultVanillaROMPath,
}: MainAppFormProps) {
  const name = useFormValue<string>("", { validate: validateName });
  const url = useFormValue<string>("", { validate: validateURL });
  const directoryPath = useFormValue(defaultDirectoryPath, {
    isDirty: defaultDirectoryPath !== "",
    validate: validateDirectoryPath,
  });
  const vanillaROMPath = useFormValue(defaultVanillaROMPath, {
    isDirty: defaultVanillaROMPath !== "",
    validate: validateVanillaROMPath,
  });

  const { download, error, status } = useDownloadHack({
    directoryPath: directoryPath.value,
    name: name.value,
    url: url.value,
    vanillaRomPath: vanillaROMPath.value,
  });

  useEffect(() => {
    writeStore({
      directoryPath: directoryPath.value,
      vanillaROMPath: vanillaROMPath.value,
    });
  }, [directoryPath.value, vanillaROMPath.value]);

  useEffect(() => {
    let unlisten: UnlistenFn = () => {};
    listen("select-hack", (event) => {
      try {
        const payload = SelectHackPayloadSchema.parse(event.payload);
        name.handleChangeValue(payload.name);
        url.handleChangeValue(payload.downloadUrl);
      } catch (e) {
        console.log(e);
        // TODO: Set generic error.
      }
    }).then((u) => {
      unlisten = u;
    });
    return unlisten;
  }, [name.handleChangeValue, url.handleChangeValue]);

  const isValid =
    name.isValid &&
    url.isValid &&
    directoryPath.isValid &&
    vanillaROMPath.isValid;

  const downloadIfValid = useCallback(() => {
    if (isValid) download();
  }, [download, isValid]);

  return (
    <Flex direction="column" gap={3}>
      <Flex justifyContent="space-between">
        <Heading size="md">Download a hack</Heading>
      </Flex>

      <Section title="Settings">
        <Flex direction="column" gap={3} pt={2}>
          <PathBrowser
            error={directoryPath.isPristine ? undefined : directoryPath.error}
            isDisabled={status === "loading"}
            mode="directory"
            onBlur={directoryPath.handleBlur}
            onChange={directoryPath.handleChangeValue}
            onSubmit={downloadIfValid}
            placeholder="Main Folder"
            value={directoryPath.value}
          />
          <PathBrowser
            error={vanillaROMPath.isPristine ? undefined : vanillaROMPath.error}
            isDisabled={status === "loading"}
            mode="file"
            onBlur={vanillaROMPath.handleBlur}
            onChange={vanillaROMPath.handleChangeValue}
            onSubmit={downloadIfValid}
            placeholder="Original File"
            value={vanillaROMPath.value}
          />
        </Flex>
      </Section>

      <Section isDefaultExpanded title="Add hack">
        <Flex direction="column" gap={3} pt={2}>
          <Button
            isDisabled={status === "loading"}
            leftIcon={<SearchIcon />}
            onClick={openSearchWindow}
            text="Search"
            variant="outline"
          />
          <TextEditor
            autoFocus
            error={name.isPristine ? undefined : name.error}
            isDisabled={status === "loading"}
            onBlur={name.handleBlur}
            onChange={name.handleChangeValue}
            onSubmit={downloadIfValid}
            placeholder="Hack Name"
            value={name.value}
          />
          <TextEditor
            error={url.isPristine ? undefined : url.error}
            isDisabled={status === "loading"}
            onBlur={url.handleBlur}
            onChange={url.handleChangeValue}
            onSubmit={downloadIfValid}
            placeholder="Download URL"
            value={url.value}
          />
          <Button
            isDisabled={!isValid || status === "loading"}
            isLoading={status === "loading"}
            onClick={downloadIfValid}
            text="Download"
          />
          {error && <Alert status="error" description={error} />}
        </Flex>
      </Section>

      <Section title="Hacks">
        <Text fontSize="sm">Nothing</Text>
      </Section>
    </Flex>
  );
}

export default MainAppForm;
