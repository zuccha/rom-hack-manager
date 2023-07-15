import { z } from "zod";

export const SelectHackPayloadSchema = z.object({
  name: z.string(),
  downloadUrl: z.string(),
});
