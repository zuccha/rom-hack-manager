import { Flex, Text } from "@chakra-ui/react";
import { emit } from "@tauri-apps/api/event";
import { getCurrent } from "@tauri-apps/api/window";
import { useCallback, useState } from "react";
import Alert from "../../components/Alert";
import Checkbox from "../../components/Checkbox";
import Frame from "../../components/Frame";
import Section from "../../components/Section";
import Table, { Column } from "../../components/Table";
import { useSelectedGameId } from "../store";
import { Hack, SearchResults } from "./useSearchHacks";

type SectionResultsProps = {
  results: SearchResults;
};

const resultsTableColumnsSMW: Column<Hack>[] = [
  { header: "Name", key: "name" },
  { header: "Authors", format: (hack: Hack) => hack.authors.join(", ") },
  { header: "Type", format: (hack: Hack) => hack.type ?? "-" },
];

const resultsTableColumnsYI: Column<Hack>[] = [
  { header: "Name", key: "name" },
  { header: "Authors", format: (hack: Hack) => hack.authors.join(", ") },
];

function SectionResults({ results }: SectionResultsProps) {
  const [selectedGameId] = useSelectedGameId();

  const [keepWindowOpen, setKeepWindowOpen] = useState(false);

  const selectHack = useCallback(
    async (hack: Hack) => {
      try {
        await emit("select-hack", { ...hack, gameId: selectedGameId });
        const searchWindow = getCurrent();
        if (!keepWindowOpen) searchWindow.close();
      } catch (e) {
        console.log(e);
        // TODO: Do what?
      }
    },
    [keepWindowOpen, selectedGameId]
  );

  if (!results)
    return (
      <Section isDefaultExpanded title="Results">
        <Flex direction="column" gap={3}>
          <Text fontSize="sm" fontStyle="italic">
            Search to find hacks.
          </Text>
        </Flex>
      </Section>
    );

  if (typeof results === "string") {
    return (
      <Section isDefaultExpanded title="Results">
        <Flex direction="column" gap={3}>
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
      <Flex direction="column" gap={3}>
        {results.hacks.length > 0 ? (
          <>
            <Frame placeholder="Options">
              <Checkbox
                label="Keep window open after selection"
                onChange={setKeepWindowOpen}
                value={keepWindowOpen}
              />
            </Frame>
            <Table
              caption={
                results.hasMore
                  ? "There are more than 50 results, please refine your search."
                  : undefined
              }
              columns={
                results.showType
                  ? resultsTableColumnsSMW
                  : resultsTableColumnsYI
              }
              data={results.hacks}
              onClickRow={selectHack}
            />
          </>
        ) : (
          <Text>Nothing</Text>
        )}
      </Flex>
    </Section>
  );
}

export default SectionResults;
