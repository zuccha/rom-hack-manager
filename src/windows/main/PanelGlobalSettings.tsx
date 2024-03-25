import { Flex, Text } from "@chakra-ui/react";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import Panel from "../../components/Panel";
import Section from "../../components/Section";
import TextEditor from "../../components/TextEditor";
import { useGlobalSettings } from "../store";
import useTauriInvoke from "../../hooks/useTauriInvoke";
import { invoke } from "@tauri-apps/api";

function PanelGlobalSettings() {
  const [globalSettings, globalSettingsMethods] = useGlobalSettings();

  const onSelectPathClick = async () => {
    try {
      const selectedPath = await invoke("select_emulator_path");
      if (typeof selectedPath === "string") {
        globalSettingsMethods.setEmulatorPath(selectedPath);
      } else {
        console.error("Selected path is not a string:", selectedPath);
      }
    } catch (error) {
      console.error("Error selecting path:", error);
    }
  };

  const onSelectedPathClear = () => {
    globalSettingsMethods.setEmulatorPath("");
  };

  return (
    <Panel>
      <Section isDefaultExpanded title="Generic">
        <Flex direction="column" gap={1}>
          <Checkbox
            label="Ask for confirmation before removing a game"
            onChange={
              globalSettingsMethods.setAskForConfirmationBeforeRemovingGame
            }
            value={globalSettings.askForConfirmationBeforeRemovingGame}
          />
          <Checkbox
            label="Ask for confirmation before deleting a hack"
            onChange={
              globalSettingsMethods.setAskForConfirmationBeforeDeletingHack
            }
            value={globalSettings.askForConfirmationBeforeDeletingHack}
          />
          <Checkbox
            label="Open hack folder after download"
            onChange={globalSettingsMethods.setOpenHackFolderAfterDownload}
            value={globalSettings.openHackFolderAfterDownload}
          />
        </Flex>
      </Section>

      <Section isDefaultExpanded title="Emulator">
        <Flex direction="column" gap={2}>
          <Text fontSize="sm">
            Set the path to your preferred emulator here. You can set optional
            command line arguments e.g. when using something like Retroarch
          </Text>
          <Flex gap={2}>
            <Button text="Select Path" onClick={onSelectPathClick} />
            <TextEditor
              value={globalSettings.emulatorPath}
              onChange={() => console.log()}
              placeholder="Path to your emulator"
              isReadOnly
            />
            <Button
              colorScheme="red"
              text="Clear"
              onClick={onSelectedPathClear}
            />
          </Flex>
          <Flex gap={2}>
            <TextEditor
              value={globalSettings.emulatorArguments}
              onChange={globalSettingsMethods.setEmulatorArguments}
              placeholder="Arguments (optional)"
            />
          </Flex>
        </Flex>
      </Section>

      <Section isDefaultExpanded title="Cookies">
        <Flex direction="column" gap={2}>
          <Text fontSize="sm">
            Use the field below to specify a custom cookie that will be used
            during search and download. The cookie can be used to bypass CAPTCHA
            tests.
          </Text>
          <Text fontSize="xs">
            For example, SMW Central may require a human verification test to
            prevent DDoS attacks. To circumvent this, complete the test on SMW
            Central's website, then copy the <i>smwc-session</i> cookie from
            your browser into the field down below.
          </Text>
          <TextEditor
            placeholder="Cookie"
            onChange={globalSettingsMethods.setCookie}
            value={globalSettings.cookie}
          />
        </Flex>
      </Section>
    </Panel>
  );
}

export default PanelGlobalSettings;
