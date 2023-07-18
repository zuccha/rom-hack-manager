import { Flex } from "@chakra-ui/react";
import Checkbox from "../../components/Checkbox";
import Frame from "../../components/Frame";
import Panel from "../../components/Panel";
import PathBrowser from "../../components/PathBrowser";
import Section from "../../components/Section";
import TextEditor from "../../components/TextEditor";
import useFormValue from "../../hooks/useFormValue";
import { useGlobalSettings } from "../store";
import { validateDirectoryPath } from "../validation";

function PanelGlobalSettings() {
  const [globalSettings, globalSettingsMethods] = useGlobalSettings();

  const emulator = useFormValue(globalSettings.emulator, {
    isDirty: globalSettings.emulator !== "",
    onChange: globalSettingsMethods.setEmulator,
    validate: validateDirectoryPath,
  });

  const emulatorArgs = useFormValue(globalSettings.emulatorArgs, {
    isDirty: globalSettings.emulatorArgs !== "",
    onChange: globalSettingsMethods.setEmulatorArgs,
  });

  return (
    <Panel>
      <Section isDefaultExpanded title="Emulator">
        <Flex direction="column" gap={3}>
          <PathBrowser
            autoFocus
            error={emulator.errorIfDirty}
            mode="file"
            onBlur={emulator.handleBlur}
            onChange={emulator.handleChangeValue}
            placeholder="Emulator"
            value={emulator.value}
          />
          <TextEditor
            error={emulatorArgs.errorIfDirty}
            onBlur={emulatorArgs.handleBlur}
            onChange={emulatorArgs.handleChangeValue}
            placeholder="Emulator Args"
            value={emulatorArgs.value}
          />
        </Flex>
      </Section>

      <Section isDefaultExpanded title="Confirmation">
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
        </Flex>
      </Section>
    </Panel>
  );
}

export default PanelGlobalSettings;
