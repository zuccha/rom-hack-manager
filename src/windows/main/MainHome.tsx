import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Center, Icon, IconButton, Tooltip } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { BsInfoLg } from "react-icons/bs";
import { MdSettings } from "react-icons/md";
import Dialog from "../../components/Dialog";
import Tabs from "../../components/Tabs";
import {
  useGame,
  useGameIds,
  useGlobalSettings,
  useSelectedGameIndex,
} from "../store";
import PanelAbout from "./PanelAbout";
import PanelGame from "./PanelGame";
import PanelGameCreation from "./PanelGameCreation";
import PanelGlobalSettings from "./PanelGlobalSettings";
import useItemRemovalDialog from "../../hooks/useItemRemovalDialog";

type GameTabProps = {
  gameId: string;
  onRemoveGame: () => void;
};

function GameTab({ gameId, onRemoveGame }: GameTabProps) {
  const [game] = useGame(gameId);
  return (
    <Center gap={1}>
      {game.name}
      <Tooltip label="Remove game">
        <IconButton
          aria-label="Remove game"
          color="gray.500"
          icon={<CloseIcon />}
          onClick={onRemoveGame}
          size="xs"
          variant="ghost"
          _hover={{ color: "black" }}
        />
      </Tooltip>
    </Center>
  );
}

function MainHome() {
  const [globalSettings] = useGlobalSettings();
  const [selectedGameIndex, { set: setSelectedGameIndex }] =
    useSelectedGameIndex();

  const [gameIds, { create: createGame, remove: removeGame }] = useGameIds();

  const gameRemovalDialog = useItemRemovalDialog(
    removeGame,
    globalSettings.askForConfirmationBeforeRemovingGame
  );

  const tabsLeft = useMemo(
    () => [
      ...gameIds.map((gameId) => ({
        body: <PanelGame gameId={gameId} />,
        header: (
          <GameTab
            gameId={gameId}
            onRemoveGame={() => gameRemovalDialog.openOrRemove(gameId)}
          />
        ),
      })),
      {
        body: <PanelGameCreation onCreateGame={createGame} />,
        header: <AddIcon />,
      },
    ],
    [createGame, gameIds, gameRemovalDialog.openOrRemove]
  );

  const tabsRight = useMemo(
    () => [
      {
        body: <PanelGlobalSettings />,
        header: <Icon as={MdSettings} />,
      },
      {
        body: <PanelAbout />,
        header: <Icon as={BsInfoLg} />,
      },
    ],
    []
  );

  return (
    <>
      <Tabs
        index={selectedGameIndex}
        onChange={setSelectedGameIndex}
        tabsLeft={tabsLeft}
        tabsRight={tabsRight}
      />

      <Dialog
        description="Removing the game will not delete the folder."
        isOpen={gameRemovalDialog.isOpen}
        onCancel={gameRemovalDialog.close}
        onConfirm={gameRemovalDialog.closeAndRemove}
        title="Remove game?"
      />
    </>
  );
}

export default MainHome;
