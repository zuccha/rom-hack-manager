import { z } from "zod";

export const SelectHackPayloadSchema = z.object({
  downloadUrl: z.string(),
  gameId: z.union([z.string(), z.undefined()]),
  name: z.string(),
});
