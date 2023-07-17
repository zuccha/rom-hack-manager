import Panel from "../../components/Panel";
import SectionFilters from "./SectionFilters";
import SectionResults from "./SectionResults";
import useSearchHacks from "./useSearchHacks";

function SearchHome() {
  const [searchHacks, isSearching, searchResults] = useSearchHacks();

  return (
    <Panel>
      <SectionFilters isSearching={isSearching} onSearchHacks={searchHacks} />
      <SectionResults results={searchResults} />
    </Panel>
  );
}

export default SearchHome;
