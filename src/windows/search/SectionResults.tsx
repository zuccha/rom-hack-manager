import { Flex, Text } from "@chakra-ui/react";
import { emit } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useCallback } from "react";
import Alert from "../../components/Alert";
import Section from "../../components/Section";
import Table, { Column } from "../../components/Table";
import { useSelectedGameId } from "../store";
import { Hack, SearchResults } from "./useSearchHacks";

type SectionResultsProps = {
  results: SearchResults;
};

const resultsTableColumns: Column<Hack>[] = [
  { header: "Name", key: "name" },
  { header: "Authors", format: (hack: Hack) => hack.authors.join(", ") },
  { header: "Type", format: (hack: Hack) => hack.type ?? "-" },
];

function SectionResults({ results }: SectionResultsProps) {
  const [selectedGameId] = useSelectedGameId();

  const selectHack = useCallback(
    async (hack: Hack) => {
      try {
        await emit("select-hack", { ...hack, gameId: selectedGameId });
        const searchWindow = WebviewWindow.getByLabel("search");
        searchWindow?.close();
      } catch (e) {
        console.log(e);
        // TODO: Do what?
      }
    },
    [selectedGameId]
  );

  if (!results)
    return (
      <Section isDefaultExpanded title="Results">
        <Flex direction="column" gap={3} mt={2}>
          <Text fontSize="sm" fontStyle="italic">
            Search to find hacks.
          </Text>
        </Flex>
      </Section>
    );

  if (typeof results === "string") {
    return (
      <Section isDefaultExpanded title="Results">
        <Flex direction="column" gap={3} mt={2}>
          <Alert description={results} status="error" />
        </Flex>
      </Section>
    );
  }

  return (
    <Section
      title={`Results (${results.hacks.length}${results.hasMore ? "+" : ""})`}
      isDefaultExpanded
    >
      <Flex direction="column" gap={3} mt={2}>
        {results.hacks.length > 0 ? (
          <Table
            caption={
              results.hasMore
                ? "There are more than 50 results, please refine your search."
                : undefined
            }
            columns={resultsTableColumns}
            data={results.hacks}
            onClickRow={selectHack}
          />
        ) : (
          <Text>Nothing</Text>
        )}
      </Flex>
    </Section>
  );
}

export default SectionResults;
