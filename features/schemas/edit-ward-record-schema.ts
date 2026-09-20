import { z } from "zod";
import { wardRecordSchema } from "@/features/schemas/ward-record-schema";

export const editWardRecordSchema = z.object({
  fields: wardRecordSchema,
});
