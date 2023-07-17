import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Center,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { useGame, useGameIds, useSelectedGameIndex } from "../store";
import PanelAbout from "./PanelAbout";
import PanelGame from "./PanelGame";
import PanelGameCreation from "./PanelGameCreation";
import Dialog from "../../components/Dialog";
import { useCallback, useState } from "react";

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
      <Center
        borderRadius="full"
        color="gray.600"
        h={REMOVE_ICON_SIZE}
        mr={-1}
        onClick={onRemoveGame}
        _hover={{ bgColor: "gray.100" }}
        w={REMOVE_ICON_SIZE}
      >
        <CloseIcon fontSize={10} />
      </Center>
    </Center>
  );
}

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

  return (
    <>
      <Tabs
        borderColor="gray.500"
        index={selectedGameIndex}
        onChange={setSelectedGameIndex}
        variant="enclosed"
      >
        <TabList>
          {gameIds.map((gameId) => (
            <Tab borderRadius={0} borderTopWidth={0} key={gameId}>
              <GameTab
                gameId={gameId}
                onRemoveGame={() => openRemoveGameDialog(gameId)}
              />
            </Tab>
          ))}
          <Tab borderRadius={0} borderTopWidth={0} minH={REMOVE_ICON_SIZE}>
            <AddIcon />
          </Tab>
          <Flex flex={1} />
          <Tab
            justifyContent="flex-end"
            borderRadius={0}
            borderTopWidth={0}
            minH={REMOVE_ICON_SIZE}
          >
            About
          </Tab>
        </TabList>

        <TabPanels>
          {gameIds.map((gameId) => (
            <TabPanel key={gameId} p={0}>
              <PanelGame gameId={gameId} />
            </TabPanel>
          ))}
          <TabPanel p={0}>
            <PanelGameCreation onCreateGame={createGame} />
          </TabPanel>

          <TabPanel p={0}>
            <PanelAbout />
          </TabPanel>
        </TabPanels>
      </Tabs>

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
