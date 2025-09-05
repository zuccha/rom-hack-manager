import { Flex, Text } from "@chakra-ui/react";
import Checkbox from "../../components/Checkbox";
import Panel from "../../components/Panel";
import PathBrowser from "../../components/PathBrowser";
import Section from "../../components/Section";
import TextEditor from "../../components/TextEditor";
import { useGlobalSettings } from "../../store/global-settings";

function PanelGlobalSettings() {
  const [globalSettings, globalSettingsMethods] = useGlobalSettings();

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
          <Checkbox
            label="Keep search window always on top"
            onChange={globalSettingsMethods.setKeepSearchWindowOnTop}
            value={globalSettings.keepSearchWindowOnTop}
          />
          <Checkbox
            label="Dark theme"
            onChange={(dark) =>
              globalSettingsMethods.setTheme(dark ? "dark" : "light")
            }
            value={globalSettings.theme === "dark"}
          />
        </Flex>
      </Section>

      <Section isDefaultExpanded title="Emulator">
        <Flex direction="column" gap={2}>
          <Text fontSize="sm">
            Use the field below to specify a custom emulator with which to open
            ROMs. If nothing is specified, the default app specified in the
            operating system for SFC files will be used. In the command line
            arguments <b>%1</b> will be replaced with the ROM path.
          </Text>
          <Flex direction="column" gap={3}>
            <PathBrowser
              mode="file"
              onChange={globalSettingsMethods.setEmulatorPath}
              value={globalSettings.emulatorPath}
              placeholder="Emulator path"
            />
            <TextEditor
              value={globalSettings.emulatorArgs}
              onChange={globalSettingsMethods.setEmulatorArgs}
              placeholder="Command Line Arguments"
              isDisabled={!globalSettings.emulatorPath.trim()}
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
