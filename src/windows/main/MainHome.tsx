import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Center, IconButton, Tooltip } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import Dialog from "../../components/Dialog";
import Tabs from "../../components/Tabs";
import { useGame, useGameIds, useSelectedGameIndex } from "../store";
import PanelAbout from "./PanelAbout";
import PanelGame from "./PanelGame";
import PanelGameCreation from "./PanelGameCreation";

type GameTabProps = {
  gameId: string;
  onRemoveGame: () => void;
};

const REMOVE_ICON_SIZE = 6;

function GameTab({ gameId, onRemoveGame }: GameTabProps) {
  const [game] = useGame(gameId);
  return (
    <Center gap={1}>
      {game.name}
      <Tooltip label="Remove game">
        <IconButton
          aria-label="Remove game"
          icon={<CloseIcon />}
          onClick={onRemoveGame}
          size="xs"
          variant="ghost"
        />
      </Tooltip>
    </Center>
  );
}

const tabProps = {
  borderRadius: 0,
  borderTopWidth: 0,
  minH: REMOVE_ICON_SIZE,
};

function MainHome() {
  const [selectedGameIndex, { set: setSelectedGameIndex }] =
    useSelectedGameIndex();

  const [gameIds, { create: createGame, remove: removeGame }] = useGameIds();

  const [gameIdToRemove, setGameIdToRemove] = useState<undefined | string>();

  const closeRemoveGameDialog = useCallback(() => {
    setGameIdToRemove(undefined);
  }, [gameIdToRemove, removeGame]);

  const closeRemoveGameDialogAndRemoveGame = useCallback(() => {
    setGameIdToRemove(undefined);
    if (gameIdToRemove) removeGame(gameIdToRemove);
  }, [gameIdToRemove, removeGame]);

  const openRemoveGameDialog = useCallback((gameId: string) => {
    setGameIdToRemove(gameId);
  }, []);

  const tabsLeft = useMemo(
    () => [
      ...gameIds.map((gameId) => ({
        body: <PanelGame gameId={gameId} />,
        header: (
          <GameTab
            gameId={gameId}
            onRemoveGame={() => openRemoveGameDialog(gameId)}
          />
        ),
      })),
      {
        body: <PanelGameCreation onCreateGame={createGame} />,
        header: <AddIcon />,
      },
    ],
    [createGame, gameIds, openRemoveGameDialog]
  );

  const tabsRight = useMemo(
    () => [
      {
        body: <PanelAbout />,
        header: "About",
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
        description="Deleting the project will not remove the folder."
        isOpen={!!gameIdToRemove}
        onCancel={closeRemoveGameDialog}
        onConfirm={closeRemoveGameDialogAndRemoveGame}
        title="Remove project?"
      />
    </>
  );
}

export default MainHome;
