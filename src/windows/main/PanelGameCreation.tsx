import { useCallback } from "react";
import { Flex } from "@chakra-ui/react";
import Button from "../../components/Button";
import Panel from "../../components/Panel";
import PathBrowser from "../../components/PathBrowser";
import Section from "../../components/Section";
import TextEditor from "../../components/TextEditor";
import useFormValue from "../../hooks/useFormValue";
import { Game } from "../../store/game";
import { useGameCreationData } from "../../store/game-creation-data";
import {
  validateDirectoryPath,
  validateFilePath,
  validateNotEmpty,
} from "../validation";

type PanelGameCreationProps = {
  onCreateGame: (gameWithoutId: Omit<Game, "id">) => void;
};

function PanelGameCreation({ onCreateGame }: PanelGameCreationProps) {
  const [gameCreationData, gameCreationDataMethods] = useGameCreationData();

  const gameName = useFormValue(gameCreationData.name, {
    onChange: gameCreationDataMethods.setName,
    validate: validateNotEmpty,
  });
  const gameDirectory = useFormValue(gameCreationData.directory, {
    onChange: gameCreationDataMethods.setDirectory,
    validate: validateDirectoryPath,
  });
  const gameOriginalCopy = useFormValue(gameCreationData.originalCopy, {
    onChange: gameCreationDataMethods.setOriginalCopy,
    validate: validateFilePath,
  });

  const isValid =
    gameName.isValid && gameDirectory.isValid && gameOriginalCopy.isValid;

  const handleCreateGame = useCallback(() => {
    if (!isValid) return;

    gameCreationDataMethods.setDirectory("");
    gameCreationDataMethods.setName("");
    gameCreationDataMethods.setOriginalCopy("");

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
