import { Flex } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Button from "../../components/Button";
import Section from "../../components/Section";
import Select from "../../components/Select";
import TextEditor from "../../components/TextEditor";
import { SearchArgs } from "./useSearchHacks";
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

const typeOptions = [
  { label: "Standard", value: "standard" },
  { label: "Kaizo", value: "kaizo" },
  { label: "Puzzle", value: "puzzle" },
  { label: "Tool-Assisted", value: "tool_assisted" },
  { label: "Pit", value: "pit" },
];

const difficultyOptions = [
  { label: "Newcomer", value: "diff_1" },
  { label: "Casual", value: "diff_2" },
  { label: "Skilled", value: "diff_3" },
  { label: "Advanced", value: "diff_4" },
  { label: "Expert", value: "diff_5" },
  { label: "Master", value: "diff_6" },
  { label: "Grandmaster", value: "diff_7" },
];

function SectionFilters({ isSearching, onSearchHacks }: SectionFiltersProps) {
  const [game, setGame] = useState<SearchArgs["game"]>("smwhacks");
  const [moderated, setModerated] = useState<SearchArgs["moderated"]>("0");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);

  const [orderField, setOrderField] =
    useState<SearchArgs["orderField"]>("date");
  const [orderDirection, setOrderDirection] =
    useState<SearchArgs["orderDirection"]>("desc");

  const [{ cookie }] = useGlobalSettings();

  const searchHacks = useCallback(() => {
    onSearchHacks({
      author,
      cookie,
      description,
      difficulties,
      game,
      moderated,
      name,
      orderField,
      orderDirection,
      types,
    });
  }, [
    author,
    cookie,
    description,
    game,
    difficulties,
    moderated,
    name,
    orderDirection,
    orderField,
    types,
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
          <Flex gap={3}>
            <Select
              isDisabled={isSearching}
              isFullWidth
              isMultiple
              onChange={setTypes}
              options={typeOptions}
              placeholder="Types"
              value={types}
            />

            <Select
              isDisabled={isSearching}
              isFullWidth
              isMultiple
              onChange={setDifficulties}
              options={difficultyOptions}
              placeholder="Difficulties"
              value={difficulties}
            />
          </Flex>
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
