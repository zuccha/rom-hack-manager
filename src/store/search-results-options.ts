import { useCallback } from "react";
import z from "zod";
import { createLocalStore } from "../utils/local-store";

export const searchResultsOptionsSchema = z.object({
  keepWindowOpen: z.boolean().default(false),
  showAuthorsColumn: z.boolean().default(true),
  showDifficultyColumn: z.boolean().default(false),
  showDownloadsColumn: z.boolean().default(false),
  showLengthColumn: z.boolean().default(true),
  showLinkColumn: z.boolean().default(true),
  showNameColumn: z.boolean().default(true),
  showRatingColumn: z.boolean().default(true),
  showSizeColumn: z.boolean().default(false),
  showTypeColumn: z.boolean().default(true),
});

export type SearchResultsOptions = z.infer<typeof searchResultsOptionsSchema>;

export const searchResultsOptionsStore = createLocalStore(
  "SearchResultsOptions",
  searchResultsOptionsSchema.parse({}),
  searchResultsOptionsSchema.parse
);

export const useSearchResultsOptions = (): [
  SearchResultsOptions,
  {
    setKeepWindowOpen: (value: boolean) => void;
    setShowAuthorsColumn: (value: boolean) => void;
    setShowDifficultyColumn: (value: boolean) => void;
    setShowDownloadsColumn: (value: boolean) => void;
    setShowLengthColumn: (value: boolean) => void;
    setShowLinkColumn: (value: boolean) => void;
    setShowNameColumn: (value: boolean) => void;
    setShowRatingColumn: (value: boolean) => void;
    setShowSizeColumn: (value: boolean) => void;
    setShowTypeColumn: (value: boolean) => void;
  }
] => {
  const [searchResultsOptions, setSearchResultsOptions] =
    searchResultsOptionsStore.use();

  const setKeepWindowOpen = useCallback(
    (keepWindowOpen: boolean) =>
      setSearchResultsOptions((oldSearchResultsOptions) => ({
        ...oldSearchResultsOptions,
        keepWindowOpen,
      })),
    [setSearchResultsOptions]
  );

  const setShowAuthorsColumn = useCallback(
    (showAuthorsColumn: boolean) =>
      setSearchResultsOptions((oldSearchResultsOptions) => ({
        ...oldSearchResultsOptions,
        showAuthorsColumn,
      })),
    [setSearchResultsOptions]
  );

  const setShowDifficultyColumn = useCallback(
    (showDifficultyColumn: boolean) =>
      setSearchResultsOptions((oldSearchResultsOptions) => ({
        ...oldSearchResultsOptions,
        showDifficultyColumn,
      })),
    [setSearchResultsOptions]
  );

  const setShowDownloadsColumn = useCallback(
    (showDownloadsColumn: boolean) =>
      setSearchResultsOptions((oldSearchResultsOptions) => ({
        ...oldSearchResultsOptions,
        showDownloadsColumn,
      })),
    [setSearchResultsOptions]
  );

  const setShowLengthColumn = useCallback(
    (showLengthColumn: boolean) =>
      setSearchResultsOptions((oldSearchResultsOptions) => ({
        ...oldSearchResultsOptions,
        showLengthColumn,
      })),
    [setSearchResultsOptions]
  );

  const setShowLinkColumn = useCallback(
    (showLinkColumn: boolean) =>
      setSearchResultsOptions((oldSearchResultsOptions) => ({
        ...oldSearchResultsOptions,
        showLinkColumn,
      })),
    [setSearchResultsOptions]
  );

  const setShowNameColumn = useCallback(
    (showNameColumn: boolean) =>
      setSearchResultsOptions((oldSearchResultsOptions) => ({
        ...oldSearchResultsOptions,
        showNameColumn,
      })),
    [setSearchResultsOptions]
  );

  const setShowRatingColumn = useCallback(
    (showRatingColumn: boolean) =>
      setSearchResultsOptions((oldSearchResultsOptions) => ({
        ...oldSearchResultsOptions,
        showRatingColumn,
      })),
    [setSearchResultsOptions]
  );

  const setShowSizeColumn = useCallback(
    (showSizeColumn: boolean) =>
      setSearchResultsOptions((oldSearchResultsOptions) => ({
        ...oldSearchResultsOptions,
        showSizeColumn,
      })),
    [setSearchResultsOptions]
  );

  const setShowTypeColumn = useCallback(
    (showTypeColumn: boolean) =>
      setSearchResultsOptions((oldSearchResultsOptions) => ({
        ...oldSearchResultsOptions,
        showTypeColumn,
      })),
    [setSearchResultsOptions]
  );

  return [
    searchResultsOptions,
    {
      setKeepWindowOpen,
      setShowAuthorsColumn,
      setShowDifficultyColumn,
      setShowDownloadsColumn,
      setShowLengthColumn,
      setShowLinkColumn,
      setShowNameColumn,
      setShowRatingColumn,
      setShowSizeColumn,
      setShowTypeColumn,
    },
  ];
};
