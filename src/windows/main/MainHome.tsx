import { Center, Icon } from "@chakra-ui/react";
import { InfoIcon, PlusIcon, SettingsIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import Dialog from "../../components/Dialog";
import IconButton from "../../components/IconButton";
import Tabs from "../../components/Tabs";
import useItemRemovalDialog from "../../hooks/useItemRemovalDialog";
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

type GameTabProps = {
  gameId: string;
  onRemoveGame: () => void;
};

function GameTab({ gameId, onRemoveGame }: GameTabProps) {
  const [game] = useGame(gameId);
  return (
    <Center gap={1}>
      {game.name}
      <IconButton icon={<XIcon />} label="Remove game" onClick={onRemoveGame} />
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
        header: <Icon as={PlusIcon} size="sm" />,
      },
    ],
    [createGame, gameIds, gameRemovalDialog.openOrRemove]
  );

  const tabsRight = useMemo(
    () => [
      {
        body: <PanelGlobalSettings />,
        header: <Icon as={SettingsIcon} size="sm" />,
      },
      {
        body: <PanelAbout />,
        header: <Icon as={InfoIcon} size="sm" />,
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
