import { Flex, Text } from "@chakra-ui/react";
import { emit } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useCallback, useMemo } from "react";
import Alert from "../../components/Alert";
import Checkbox from "../../components/Checkbox";
import Frame from "../../components/Frame";
import Section from "../../components/Section";
import Table, { Column } from "../../components/Table";
import { useSelectedGameId } from "../../store/configuration";
import { useSearchResultsOptions } from "../../store/search-results-options";
import { Hack, SearchResults } from "./useSearchHacks";

type SectionResultsProps = {
  results: SearchResults;
};

const formatAuthors = (hack: Hack): string => hack.authors.join(", ");

const formatDownloads = (hack: Hack): string =>
  hack.downloads === undefined
    ? "-"
    : `${hack.downloads.toLocaleString(undefined, {
        minimumFractionDigits: 0,
      })}`;

const formatDifficulty = (hack: Hack): string => hack.difficulty ?? "-";

const formatLength = (hack: Hack): string => hack.length ?? "-";

const formatRating = (hack: Hack): string =>
  hack.rating === undefined ? "-" : hack.rating.toFixed(1);

function formatSize(hack: Hack) {
  if (hack.size === undefined) return "-";
  if (!+hack.size) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  const i = Math.floor(Math.log(hack.size) / Math.log(k));
  return `${parseFloat((hack.size / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

const formatType = (hack: Hack): string => hack.type ?? "-";

function SectionResults({ results }: SectionResultsProps) {
  const [selectedGameId] = useSelectedGameId();

  const [options, optionsMethods] = useSearchResultsOptions();

  const selectHack = useCallback(
    async (hack: Hack) => {
      try {
        await emit("select-hack", { ...hack, gameId: selectedGameId });
        const searchWindow = getCurrentWebviewWindow();
        if (!options.keepWindowOpen) searchWindow.close();
      } catch (e) {
        console.error(e);
        // TODO: Do what?
      }
    },
    [options.keepWindowOpen, selectedGameId]
  );

  const resultsTableColumns = useMemo(() => {
    const columns: Column<Hack>[] = [];
    if (options.showNameColumn) columns.push({ header: "Name", key: "name" });
    if (options.showAuthorsColumn)
      columns.push({ header: "Authors", format: formatAuthors });
    if (options.showTypeColumn)
      columns.push({
        header: "Type",
        format: formatType,
        width: "14em",
      });
    if (options.showDifficultyColumn)
      columns.push({
        header: "Difficulty",
        format: formatDifficulty,
        width: "14em",
      });
    if (options.showLengthColumn)
      columns.push({ header: "Length", format: formatLength, width: "9em" });
    if (options.showRatingColumn)
      columns.push({ header: "Rating", format: formatRating, width: "7.5em" });
    if (options.showSizeColumn)
      columns.push({ header: "Size", format: formatSize, width: "9em" });
    if (options.showDownloadsColumn)
      columns.push({ header: "⬇️", format: formatDownloads, width: "7.5em" });
    return columns;
  }, [
    results,
    options.showAuthorsColumn,
    options.showDifficultyColumn,
    options.showDownloadsColumn,
    options.showLengthColumn,
    options.showNameColumn,
    options.showRatingColumn,
    options.showSizeColumn,
    options.showTypeColumn,
  ]);

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
              <Flex direction="column">
                <Flex columnGap={3} flexWrap="wrap">
                  <Text fontSize="sm">Columns visibility:</Text>
                  <Checkbox
                    label="Name"
                    onChange={optionsMethods.setShowNameColumn}
                    value={options.showNameColumn}
                  />
                  <Checkbox
                    label="Authors"
                    onChange={optionsMethods.setShowAuthorsColumn}
                    value={options.showAuthorsColumn}
                  />
                  {results.showType && (
                    <Checkbox
                      label="Type"
                      onChange={optionsMethods.setShowTypeColumn}
                      value={options.showTypeColumn}
                    />
                  )}
                  {results.showDifficulty && (
                    <Checkbox
                      label="Difficulty"
                      onChange={optionsMethods.setShowDifficultyColumn}
                      value={options.showDifficultyColumn}
                    />
                  )}
                  <Checkbox
                    label="Length"
                    onChange={optionsMethods.setShowLengthColumn}
                    value={options.showLengthColumn}
                  />
                  <Checkbox
                    label="Rating"
                    onChange={optionsMethods.setShowRatingColumn}
                    value={options.showRatingColumn}
                  />
                  <Checkbox
                    label="Size"
                    onChange={optionsMethods.setShowSizeColumn}
                    value={options.showSizeColumn}
                  />
                  <Checkbox
                    label="Downloads"
                    onChange={optionsMethods.setShowDownloadsColumn}
                    value={options.showDownloadsColumn}
                  />
                </Flex>
                <Checkbox
                  label="Keep window open after selection"
                  onChange={optionsMethods.setKeepWindowOpen}
                  value={options.keepWindowOpen}
                />
              </Flex>
            </Frame>
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
          </>
        ) : (
          <Text>Nothing</Text>
        )}
      </Flex>
    </Section>
  );
}

export default SectionResults;
