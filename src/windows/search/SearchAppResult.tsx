import { z } from "zod";
import Button from "../../components/Button";
import { useCallback } from "react";
import { emit } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/window";

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
      <div className="column">
        <div className="v-spacer" />
        <div className="v-spacer" />

        <div className="text-danger">{result}</div>
      </div>
    );
  }

  return (
    <div className="column justify-stretch">
      <div className="v-spacer" />
      <div className="v-spacer" />

      <div className="header">
        <span>Results</span>
      </div>
      {result.hacks.length > 0 ? (
        <div className="list">
          {result.hacks.map((hack) => (
            <div key={hack.name} className="row" onClick={() => select(hack)}>
              <span className="hack-name">{hack.name}</span>
              {hack.authors.length > 0 && (
                <span className="hack-authors">{`[${hack.authors.join(
                  ", "
                )}]`}</span>
              )}
              {hack.type && <span className="hack-type">{hack.type}</span>}
            </div>
          ))}
        </div>
      ) : (
        <div>Nothing</div>
      )}
    </div>
  );
}

export default SearchAppResult;
