import { Hack, HackSchema } from "./useSearchHacks";

export const parseSuperMarioWorldRow = (row: Element): Hack => {
  const maybeHack = {
    authors:
      [...(row.children[5]?.getElementsByTagName("a") ?? [])].map(
        (a) => a.innerHTML
      ) ?? [],
    date: new Date(
      row.children[0]?.children[2]?.children[0]?.getAttribute("datetime") ?? ""
    ),
    downloadUrl: row.children[8]?.children[0]?.getAttribute("href"),
    downloads: row.children[8]?.children[2]?.innerHTML,
    length: row.children[3]?.innerHTML,
    name: row.children[0]?.children[0]?.innerHTML,
    rating: row.children[6]?.innerHTML,
    type: row.children[4]?.innerHTML,
  };
  return HackSchema.parse(maybeHack);
};

export const parseYoshiIslandRow = (row: Element): Hack => {
  const maybeHack = {
    authors:
      [...(row.children[3]?.getElementsByTagName("a") ?? [])].map(
        (a) => a.innerHTML
      ) ?? [],
    date: new Date(
      row.children[0]?.children[2]?.children[0]?.getAttribute("datetime") ?? ""
    ),
    downloadUrl: row.children[6]?.children[0]?.getAttribute("href"),
    downloads: row.children[6]?.children[2]?.innerHTML,
    length: row.children[2]?.innerHTML,
    name: row.children[0]?.children[0]?.innerHTML,
    rating: row.children[4]?.innerHTML,
    type: "-",
  };
  return HackSchema.parse(maybeHack);
};
