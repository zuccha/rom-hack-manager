import { getClient, ResponseType } from "@tauri-apps/api/http";
import { useCallback, useState } from "react";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import TextEditor from "../../components/TextEditor";
import SearchAppResult, {
  Hack,
  HackSchema,
  SearchResult,
} from "./SearchAppResult";

const difficulties = [
  { label: "Standard: Easy", code: 104 },
  { label: "Standard: Normal", code: 105 },
  { label: "Standard: Hard", code: 106 },
  { label: "Standard: Very Hard", code: 141 },
  { label: "Kaizo: Beginner", code: 196 },
  { label: "Kaizo: Intermediate", code: 107 },
  { label: "Kaizo: Expert", code: 197 },
  { label: "Tool Assisted: Kaizo", code: 124 },
  { label: "Tool Assisted: Pit", code: 125 },
  { label: "Misc.: Troll", code: 161 },
] as const;

type Difficulty = (typeof difficulties)[number]["label"];

function SearchApp() {
  const [isSearching, setIsSearching] = useState(false);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [isDifficultySelected, setIsDifficultySelected] = useState<{
    [D in Difficulty]?: boolean | undefined;
  }>({});

  const [searchResult, setSetSearchResult] = useState<SearchResult>();

  const toggleDifficulty = useCallback(
    (difficulty: Difficulty) => () => {
      setIsDifficultySelected((prevIsDifficultySelected) => ({
        ...prevIsDifficultySelected,
        [difficulty]: !prevIsDifficultySelected[difficulty],
      }));
    },
    []
  );

  const search = useCallback(async () => {
    setIsSearching(true);
    const url = new URL("https://www.smwcentral.net/");
    url.searchParams.set("p", "section");
    url.searchParams.set("s", "smwhacks"); // Game (smwhacks, yihacks)
    url.searchParams.set("u", "0"); // Unknown
    url.searchParams.set("g", "0"); // Gallery (0 = no, 1 = yes)
    url.searchParams.set("n", "1"); // Page (starts from 1)
    url.searchParams.set("o", "date"); // Order field (date, name, featured, length, rating, filesize, downloads)
    url.searchParams.set("d", "desc"); // Order type (asc, desc)
    if (name) url.searchParams.set("f[name]", name); // Name
    if (author) url.searchParams.set("f[author]", author); // Author
    if (description) url.searchParams.set("f[description]", description); // Description
    difficulties.forEach((difficulty) => {
      if (isDifficultySelected[difficulty.label])
        url.searchParams.append("f[difficulty][]", `${difficulty.code}`);
    });
    try {
      console.log(url.toString());
      const client = await getClient();
      const responseType = ResponseType.Text;
      const { data } = await client.get(url.toString(), { responseType });
      if (typeof data !== "string") throw new Error("Data is not a string");
      const parser = new DOMParser();
      const html = parser.parseFromString(data, "text/html");
      const tbody = html.querySelector("table.list>tbody");
      if (!tbody) throw new Error("Results table not found");

      const hacks: Hack[] = [];
      for (const row of [...tbody.children]) {
        const maybeHack = {
          authors:
            [...(row.children[5]?.getElementsByTagName("a") ?? [])].map(
              (a) => a.innerHTML
            ) ?? [],
          date: new Date(
            row.children[0]?.children[2]?.children[0]?.getAttribute(
              "datetime"
            ) ?? ""
          ),
          downloadUrl: (row.children[8]?.children[0] as HTMLAnchorElement).href,
          downloads: row.children[8]?.children[2]?.innerHTML,
          length: row.children[3]?.innerHTML,
          name: row.children[0]?.children[0]?.innerHTML,
          rating: row.children[6]?.innerHTML,
          type: row.children[4]?.innerHTML,
        };
        const hack = HackSchema.parse(maybeHack);
        hacks.push(hack);
      }
      setSetSearchResult({ hacks, hasMore: false });
    } catch (e) {
      setSetSearchResult("Failed to look for hacks");
      console.log(e);
    } finally {
      setIsSearching(false);
    }
  }, [author, description, isDifficultySelected, name]);

  return (
    <div className="container column">
      <div className="header">
        <span>Search hack</span>
      </div>

      <TextEditor
        isDisabled={isSearching}
        autoFocus
        isFullWidth
        onChange={setName}
        placeholder="Name"
        value={name}
      />

      <div className="v-spacer" />

      <TextEditor
        isDisabled={isSearching}
        isFullWidth
        onChange={setAuthor}
        placeholder="Author"
        value={author}
      />

      <div className="v-spacer" />

      <TextEditor
        isDisabled={isSearching}
        isFullWidth
        onChange={setDescription}
        placeholder="Description"
        value={description}
      />

      <div className="v-spacer" />
      <div className="v-spacer" />

      <div className="grid">
        {difficulties.map((difficulty) => (
          <Checkbox
            key={difficulty.label}
            isDisabled={isSearching}
            label={difficulty.label}
            onToggle={toggleDifficulty(difficulty.label)}
            value={!!isDifficultySelected[difficulty.label]}
          />
        ))}
      </div>

      <div className="v-spacer" />
      <div className="v-spacer" />

      <Button
        className="flex-1"
        isDisabled={isSearching}
        onClick={search}
        text="Search"
      />

      <div className="v-spacer" />
      <div className="v-spacer" />

      <SearchAppResult result={searchResult} />
    </div>
  );
}

export default SearchApp;
