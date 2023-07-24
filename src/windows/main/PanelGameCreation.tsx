import { useCallback } from "react";
import Button from "../../components/Button";
import Panel from "../../components/Panel";
import PathBrowser from "../../components/PathBrowser";
import TextEditor from "../../components/TextEditor";
import useFormValue from "../../hooks/useFormValue";
import { Game } from "../store";
import {
  validateDirectoryPath,
  validateFilePath,
  validateNotEmpty,
} from "../validation";
import { Flex } from "@chakra-ui/react";
import Section from "../../components/Section";

type PanelGameCreationProps = {
  onCreateGame: (gameWithoutId: Omit<Game, "id">) => void;
};

const ES: string = "";

function PanelGameCreation({ onCreateGame }: PanelGameCreationProps) {
  const gameName = useFormValue(ES, { validate: validateNotEmpty });
  const gameDirectory = useFormValue(ES, { validate: validateDirectoryPath });
  const gameOriginalCopy = useFormValue(ES, { validate: validateFilePath });

  const isValid =
    gameName.isValid && gameDirectory.isValid && gameOriginalCopy.isValid;

  const handleCreateGame = useCallback(() => {
    if (!isValid) return;

    onCreateGame({
      directory: gameDirectory.value,
      name: gameName.value,
      originalCopy: gameOriginalCopy.value,
    });
  }, [gameDirectory.value, gameName.value, gameOriginalCopy.value, isValid]);

  return (
    <Panel>
      <Section isDefaultExpanded title="Configure a game">
        <Flex direction="column" gap={3}>
          <TextEditor
            autoFocus
            error={gameName.errorIfDirty}
            onBlur={gameName.handleBlur}
            onChange={gameName.handleChangeValue}
            onSubmit={handleCreateGame}
            placeholder="Game Name"
            value={gameName.value}
          />
          <PathBrowser
            error={gameDirectory.errorIfDirty}
            mode="directory"
            onBlur={gameDirectory.handleBlur}
            onChange={gameDirectory.handleChangeValue}
            onSubmit={handleCreateGame}
            placeholder="Game Folder"
            value={gameDirectory.value}
          />
          <PathBrowser
            error={gameOriginalCopy.errorIfDirty}
            mode="file"
            onBlur={gameOriginalCopy.handleBlur}
            onChange={gameOriginalCopy.handleChangeValue}
            onSubmit={handleCreateGame}
            placeholder="Game Original Copy"
            value={gameOriginalCopy.value}
          />
          <Button isDisabled={!isValid} onClick={handleCreateGame} text="Add" />
        </Flex>
      </Section>
    </Panel>
  );
}

export default PanelGameCreation;
