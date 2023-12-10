import { Flex } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import Frame from "../../components/Frame";
import Section from "../../components/Section";
import Select from "../../components/Select";
import TextEditor from "../../components/TextEditor";
import {
  Difficulty,
  DifficultyMap,
  SearchArgs,
  difficulties,
} from "./useSearchHacks";
import { useGlobalSettings } from "../store";

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
    (difficulty: Difficulty) => (value: boolean) => {
      setIsDifficultySelected((prevIsDifficultySelected) => ({
        ...prevIsDifficultySelected,
        [difficulty]: value,
      }));
    },
    []
  );

  const [{ cookie }] = useGlobalSettings();

  const searchHacks = useCallback(() => {
    onSearchHacks({
      author,
      description,
      game,
      isDifficultySelected,
      name,
      cookie,
    });
  }, [author, description, game, isDifficultySelected, name]);

  return (
    <Section isDefaultExpanded title="Filters">
      <Flex direction="column" gap={3}>
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
          <Frame minChildWidth={160} placeholder="Difficulty">
            {difficulties.map((difficulty) => (
              <Checkbox
                key={difficulty.label}
                isDisabled={isSearching}
                label={difficulty.label}
                onChange={toggleDifficulty(difficulty.label)}
                value={!!isDifficultySelected[difficulty.label]}
              />
            ))}
          </Frame>
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
