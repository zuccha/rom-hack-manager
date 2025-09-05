import { fetch } from "@tauri-apps/plugin-http";
import { useCallback, useState } from "react";
import { z } from "zod";

export const difficulties = [
  { label: "Standard: Easy", short: "easy" },
  { label: "Standard: Normal", short: "normal" },
  { label: "Standard: Hard", short: "hard" },
  { label: "Standard: Very Hard", short: "very_hard" },
  { label: "Kaizo: Beginner", short: "kaizo_beginner" },
  { label: "Kaizo: Intermediate", short: "kaizo_light" },
  { label: "Kaizo: Expert", short: "kaizo_expert" },
  { label: "Tool Assisted: Kaizo", short: "kaizo_hard" },
  { label: "Tool Assisted: Pit", short: "pit" },
  { label: "Misc.: Troll", short: "troll" },
  { label: "Misc.: Puzzle", short: "puzzle" },
] as const;

export type Difficulty = (typeof difficulties)[number]["label"];

export type DifficultyMap = { [D in Difficulty]?: boolean | undefined };

export const HackSchema = z.object({
  authors: z.array(z.string()),
  date: z.union([z.date(), z.undefined()]),
  downloadUrl: z.string().transform((value) => `https:${value}`),
  downloads: z.union([z.number(), z.undefined()]),
  length: z.union([z.string(), z.undefined()]),
  name: z.string().transform((value) => value.replace(/&amp;/g, "&")),
  rating: z.union([z.number(), z.undefined()]),
  size: z.union([z.number(), z.undefined()]),
  type: z.union([z.string(), z.undefined()]),
});

export type Hack = z.infer<typeof HackSchema>;

export type SearchArgs = {
  author: string;
  cookie?: string;
  description: string;
  game: "smwhacks" | "yihacks";
  isDifficultySelected: DifficultyMap;
  moderated: "0" | "1";
  name: string;
  orderDirection: "asc" | "desc";
  orderField:
    | "date"
    | "name"
    | "featured"
    | "length"
    | "rating"
    | "filesize"
    | "downloads";
};

export type SearchResults =
  | { hacks: Hack[]; hasMore: boolean; showType: boolean }
  | string
  | undefined;

const SuperMarioWorldResponseSchema = z
  .object({
    current_page: z.number(),
    last_page: z.number(),
    data: z.array(
      z
        .object({
          authors: z.array(
            z.object({ name: z.string() }).transform((value) => value.name)
          ),
          download_url: z.string(),
          downloads: z.number(),
          name: z.string(),
          rating: z.number(),
          fields: z.object({
            difficulty: z.string(),
            length: z.string(),
          }),
          size: z.number(),
        })
        .transform((value) => ({
          authors: value.authors,
          date: undefined,
          downloadUrl: value.download_url,
          downloads: value.downloads,
          length: value.fields.length,
          name: value.name,
          rating: value.rating,
          type: value.fields.difficulty,
          size: value.size,
        }))
    ),
  })
  .transform((value) => ({
    hacks: value.data,
    hasMore: value.current_page < value.last_page,
    showType: true,
  }));

const YoshiIslandResponseSchema = z
  .object({
    current_page: z.number(),
    last_page: z.number(),
    data: z.array(
      z
        .object({
          authors: z.array(
            z.object({ name: z.string() }).transform((value) => value.name)
          ),
          download_url: z.string(),
          downloads: z.number(),
          name: z.string(),
          rating: z.number(),
          fields: z.object({
            length: z.string(),
          }),
          size: z.number(),
        })
        .transform((value) => ({
          authors: value.authors,
          date: undefined,
          downloadUrl: value.download_url,
          downloads: value.downloads,
          length: value.fields.length,
          name: value.name,
          rating: value.rating,
          type: "",
          size: value.size,
        }))
    ),
  })
  .transform((value) => ({
    hacks: value.data,
    hasMore: value.current_page < value.last_page,
    showType: false,
  }));

const useSearchHacks = (): [
  (args: SearchArgs) => void,
  boolean,
  SearchResults
] => {
  const [results, setResults] = useState<SearchResults>();
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(
    async ({
      author,
      cookie,
      description,
      game,
      isDifficultySelected,
      moderated,
      name,
      orderDirection,
      orderField,
    }: SearchArgs) => {
      if (isSearching) return;

      setIsSearching(true);

      const url = new URL("https://www.smwcentral.net/ajax.php");

      url.searchParams.set("a", "getsectionlist");
      url.searchParams.set("p", "section");
      url.searchParams.set("s", game); // Game (smwhacks, yihacks)
      url.searchParams.set("u", moderated); // Moderated (0 = yes, 1 = no)
      url.searchParams.set("g", "0"); // Gallery (0 = no, 1 = yes)
      url.searchParams.set("n", "1"); // Page (starts from 1)
      url.searchParams.set("o", orderField); // Order field (date, name, featured, length, rating, filesize, downloads)
      url.searchParams.set("d", orderDirection); // Order direction (asc, desc)

      if (name) url.searchParams.set("f[name]", name); // Name
      if (author) url.searchParams.set("f[author]", author); // Author
      if (description) url.searchParams.set("f[description]", description); // Description

      if (game === "smwhacks")
        for (const difficulty of difficulties)
          if (isDifficultySelected[difficulty.label])
            url.searchParams.append("f[difficulty][]", difficulty.short);

      try {
        // Send request.
        console.log(url.toString());
        const response = await fetch(url.toString(), {
          ...(cookie && { headers: { Cookie: cookie } }),
        });
        const json = await response.json();

        // Parse response to find the hacks table.
        setResults(
          game === "smwhacks"
            ? SuperMarioWorldResponseSchema.parse(json)
            : YoshiIslandResponseSchema.parse(json)
        );
      } catch (e) {
        setResults("An error occurred");
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    },
    [isSearching]
  );

  return [search, isSearching, results];
};

export default useSearchHacks;
