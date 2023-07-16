import { z } from "zod";
import Button from "../../components/Button";
import { useCallback, useMemo } from "react";
import { emit } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/window";
import { Flex, Heading, Text } from "@chakra-ui/react";
import Alert from "../../components/Alert";
import Table, { Column } from "../../components/Table";

export const HackSchema = z.object({
  authors: z.array(z.string()),
  date: z.union([z.date(), z.undefined()]),
  downloadUrl: z.string().transform((value) => `https:${value}`),
  downloads: z.union([z.string(), z.undefined()]),
  length: z.union([z.string(), z.undefined()]),
  name: z.string().transform((value) => value.replace(/&amp;/g, "&")),
  rating: z.union([z.string(), z.undefined()]),
  type: z.union([z.string(), z.undefined()]),
});

export type Hack = z.infer<typeof HackSchema>;

export type SearchResult =
  | {
      hacks: Hack[];
      hasMore: boolean;
    }
  | string
  | undefined;

type SearchAppResultProps = {
  result: SearchResult;
};

const resultsTableColumns: Column<Hack>[] = [
  { header: "Name", key: "name" },
  { header: "Authors", format: (hack: Hack) => hack.authors.join(", ") },
  { header: "Type", format: (hack: Hack) => hack.type ?? "-" },
];

function SearchAppResult({ result }: SearchAppResultProps) {
  const select = useCallback(async (hack: Hack) => {
    try {
      await emit("select-hack", hack);
      const searchWindow = WebviewWindow.getByLabel("search");
      searchWindow?.close();
    } catch (e) {
      console.log(e);
      // TODO: Do what?
    }
  }, []);

  if (!result) return null;

  if (typeof result === "string") {
    return (
      <Flex direction="column" gap={2} mt={2}>
        <Alert description={result} status="error" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={2} mt={2}>
      <Heading size="sm">
        Results ({result.hacks.length}
        {result.hasMore ? "+" : ""})
      </Heading>

      {result.hacks.length > 0 ? (
        <Table
          caption={
            result.hasMore
              ? "There are more than 50 results, please refine your search."
              : undefined
          }
          columns={resultsTableColumns}
          data={result.hacks}
          onClickRow={select}
        />
      ) : (
        <Text>Nothing</Text>
      )}
    </Flex>
  );
}

export default SearchAppResult;
