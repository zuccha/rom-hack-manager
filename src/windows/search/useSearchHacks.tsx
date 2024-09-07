import { ResponseType, getClient } from "@tauri-apps/api/http";
import { useCallback, useState } from "react";
import { z } from "zod";

export const difficulties = [
  { label: "Standard: Easy", code: 104, short: "easy" },
  { label: "Standard: Normal", code: 105, short: "normal" },
  { label: "Standard: Hard", code: 106, short: "hard" },
  { label: "Standard: Very Hard", code: 141, short: "very_hard" },
  { label: "Kaizo: Beginner", code: 196, short: "kaizo_beginner" },
  { label: "Kaizo: Intermediate", code: 107, short: "kaizo_light" },
  { label: "Kaizo: Expert", code: 197, short: "kaizo_expert" },
  { label: "Tool Assisted: Kaizo", code: 124, short: "kaizo_hard" },
  { label: "Tool Assisted: Pit", code: 125, short: "pit" },
  { label: "Misc.: Troll", code: 161, short: "troll" },
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
        const client = await getClient();
        const responseType = ResponseType.Text;
        console.log(url.toString());
        const { data } = await client.get(url.toString(), {
          responseType,
          ...(cookie && { headers: { Cookie: cookie } }),
        });

        // Parse response to find the hacks table.
        if (typeof data !== "string") throw new Error("Data is not a string");
        setResults(
          game === "smwhacks"
            ? SuperMarioWorldResponseSchema.parse(JSON.parse(data))
            : YoshiIslandResponseSchema.parse(JSON.parse(data))
        );
      } catch (e) {
        setResults("An error occurred");
        console.log(e);
      } finally {
        setIsSearching(false);
      }
    },
    [isSearching]
  );

  return [search, isSearching, results];
};

export default useSearchHacks;
