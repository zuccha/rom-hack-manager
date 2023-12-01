import { Flex } from "@chakra-ui/react";
import Checkbox from "../../components/Checkbox";
import Panel from "../../components/Panel";
import Section from "../../components/Section";
import { useGlobalSettings } from "../store";
import TextEditor from "../../components/TextEditor";

function PanelGlobalSettings() {
  const [globalSettings, globalSettingsMethods] = useGlobalSettings();

  return (
    <Panel>
      <Section isDefaultExpanded title="Global Settings">
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
          <TextEditor
            placeholder="Copy a cookie to prevent DDOS error"
            onChange={
              globalSettingsMethods.setCookie
            }
            value={
              globalSettings.cookie
            }
          />
        </Flex>
      </Section>
    </Panel>
  );
}

export default PanelGlobalSettings;
