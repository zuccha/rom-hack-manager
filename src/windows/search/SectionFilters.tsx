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

const moderatedOptions = [
  { label: "Moderated", value: "0" as const },
  { label: "Waiting", value: "1" as const },
];

const orderFieldOptions = [
  { label: "Name", value: "name" as const },
  { label: "Date", value: "date" as const },
  { label: "Featured", value: "featured" as const },
  { label: "Length (exits)", value: "length" as const },
  { label: "Size (bytes)", value: "filesize" as const },
  { label: "Rating", value: "rating" as const },
  { label: "Downloads", value: "downloads" as const },
];

const orderDirectionOptions = [
  { label: "Ascending", value: "asc" as const },
  { label: "Descending", value: "desc" as const },
];

function SectionFilters({ isSearching, onSearchHacks }: SectionFiltersProps) {
  const [game, setGame] = useState<SearchArgs["game"]>("smwhacks");
  const [moderated, setModerated] = useState<SearchArgs["moderated"]>("0");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [isDifficultySelected, setIsDifficultySelected] =
    useState<DifficultyMap>({});
  const [orderField, setOrderField] =
    useState<SearchArgs["orderField"]>("date");
  const [orderDirection, setOrderDirection] =
    useState<SearchArgs["orderDirection"]>("desc");

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
      cookie,
      description,
      game,
      isDifficultySelected,
      moderated,
      name,
      orderField,
      orderDirection,
    });
  }, [
    author,
    cookie,
    description,
    game,
    isDifficultySelected,
    moderated,
    name,
    orderDirection,
    orderField,
  ]);

  return (
    <Section isDefaultExpanded title="Filters">
      <Flex direction="column" gap={3}>
        <Flex gap={3}>
          <Select
            isDisabled={isSearching}
            isFullWidth
            onChange={setGame}
            options={gameOptions}
            placeholder="Game"
            value={game}
          />

          <Select
            isDisabled={isSearching}
            isFullWidth
            onChange={setModerated}
            options={moderatedOptions}
            placeholder="Moderation status"
            value={moderated}
          />
        </Flex>

        <Flex gap={3}>
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
        </Flex>

        <TextEditor
          isDisabled={isSearching}
          onChange={setDescription}
          onSubmit={searchHacks}
          placeholder="Description"
          value={description}
        />

        <Flex gap={3}>
          <Select
            isDisabled={isSearching}
            isFullWidth
            onChange={setOrderField}
            options={orderFieldOptions}
            placeholder="Sort by"
            value={orderField}
          />

          <Select
            isDisabled={isSearching}
            isFullWidth
            onChange={setOrderDirection}
            options={orderDirectionOptions}
            placeholder="Sort direction"
            value={orderDirection}
          />
        </Flex>

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
