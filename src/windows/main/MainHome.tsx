import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useGame, useGameIds, useSelectedGameIndex } from "../store";
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

  return (
    <Tabs
      borderColor="blue.600"
      index={selectedGameIndex}
      onChange={setSelectedGameIndex}
      variant="enclosed"
    >
      <TabList>
        {gameIds.map((gameId) => (
          <Tab borderRadius={0} borderTopWidth={0} key={gameId}>
            <GameTab gameId={gameId} onRemoveGame={() => removeGame(gameId)} />
          </Tab>
        ))}
        <Tab borderRadius={0} borderTopWidth={0} minH={REMOVE_ICON_SIZE}>
          <AddIcon />
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
      </TabPanels>
    </Tabs>
  );
}

export default MainHome;
