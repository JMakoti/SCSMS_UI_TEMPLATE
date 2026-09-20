import { z } from "zod";
import { addSchoolSchema } from "@/features/schemas/add-school-schema";

export const editSchoolRecordSchema = z.object({
  fields: addSchoolSchema,
});
