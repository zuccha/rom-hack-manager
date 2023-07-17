import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import Section from "../../components/Section";
import TextEditor from "../../components/TextEditor";
import {
  Difficulty,
  DifficultyMap,
  SearchArgs,
  difficulties,
} from "./useSearchHacks";
import Select from "../../components/Select";

type SectionFiltersProps = {
  isSearching: boolean;
  onSearchHacks: (args: SearchArgs) => void;
};

const gameOptions = [
  { label: "Super Mario World", value: "smwhacks" as const },
  { label: "Yoshi Island", value: "yihacks" as const },
];

function SectionFilters({ isSearching, onSearchHacks }: SectionFiltersProps) {
  const [game, setGame] = useState<"smwhacks" | "yihacks">("smwhacks");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [isDifficultySelected, setIsDifficultySelected] =
    useState<DifficultyMap>({});

  const toggleDifficulty = useCallback(
    (difficulty: Difficulty) => () => {
      setIsDifficultySelected((prevIsDifficultySelected) => ({
        ...prevIsDifficultySelected,
        [difficulty]: !prevIsDifficultySelected[difficulty],
      }));
    },
    []
  );

  const searchHacks = useCallback(() => {
    onSearchHacks({
      author,
      description,
      game,
      isDifficultySelected,
      name,
    });
  }, [author, description, game, isDifficultySelected, name]);

  return (
    <Section isDefaultExpanded title="Filters">
      <Flex direction="column" gap={3} mt={2}>
        <Select
          isDisabled={isSearching}
          onChange={setGame}
          options={gameOptions}
          placeholder="Game"
          value={game}
        />

        <TextEditor
          autoFocus
          isDisabled={isSearching}
          onChange={setName}
          onSubmit={searchHacks}
          placeholder="Name"
          value={name}
        />

        <TextEditor
          isDisabled={isSearching}
          onChange={setAuthor}
          onSubmit={searchHacks}
          placeholder="Author"
          value={author}
        />

        <TextEditor
          isDisabled={isSearching}
          onChange={setDescription}
          onSubmit={searchHacks}
          placeholder="Description"
          value={description}
        />

        {game === "smwhacks" && (
          <SimpleGrid
            bg="white"
            borderWidth={1}
            columnGap={1}
            minChildWidth={160}
            p={2}
          >
            {difficulties.map((difficulty) => (
              <Checkbox
                key={difficulty.label}
                isDisabled={isSearching}
                label={difficulty.label}
                onToggle={toggleDifficulty(difficulty.label)}
                value={!!isDifficultySelected[difficulty.label]}
              />
            ))}
          </SimpleGrid>
        )}

        <Button
          isDisabled={isSearching}
          isLoading={isSearching}
          onClick={searchHacks}
          text="Search"
        />
      </Flex>
    </Section>
  );
}

export default SectionFilters;
