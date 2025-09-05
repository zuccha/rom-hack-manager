import z, { ZodType } from "zod";
import { globalSettingsSchema } from "./global-settings";
import { searchResultsOptionsSchema } from "./search-results-options";
import { gameSchema } from "./game";

export function migrate() {
  try {
    const recoil = localStorage.getItem("recoil-persist");
    if (!recoil) return;

    const json = JSON.parse(recoil);
    if (typeof json !== "object") return;

    const migrateValue = (key: string, schema: ZodType) => {
      const value = schema.safeParse(json[key]);
      if (value.success && !localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(value.data));
    };

    migrateValue("GameIds", z.array(z.string()));
    migrateValue("SelectedGameIndex", z.number());
    migrateValue("GlobalSettings", globalSettingsSchema);
    migrateValue("SearchResultsOptions", searchResultsOptionsSchema);

    for (const [key, value] of Object.entries(json)) {
      if (/^Game__"game_\d+"$/.test(key)) {
        const game = gameSchema.safeParse(value);
        if (game.success && !localStorage.getItem(game.data.id)) {
          const id = `Game/${game.data.id}`;
          localStorage.setItem(id, JSON.stringify(game.data));
        }
      }
    }

    localStorage.removeItem("recoil-persist");
  } catch (e) {
    console.error(e);
    localStorage.removeItem("recoil-persist");
  }
}
