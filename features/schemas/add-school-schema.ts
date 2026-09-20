import { z } from "zod";
import { requiredText } from "@/features/schemas/required-text";

export const addSchoolSchema = z.object({
  schoolCode: z.string().trim().optional(),
  uicCode: z.string().trim().optional(),
  officialName: requiredText("Official school name"),
  displayName: requiredText("Display name"),
  institutionType: z.enum([
    "PRIMARY",
    "JUNIOR_SECONDARY",
    "SENIOR_SECONDARY",
    "INTEGRATED",
  ]),
  sourceInstitutionType: z.string().trim().optional(),
  ownershipType: z.enum([
    "PUBLIC",
    "PRIVATE",
    "FAITH_BASED",
    "OTHER",
    "UNKNOWN",
  ]),
  genderType: z.enum(["MIXED", "BOYS", "GIRLS", "UNKNOWN"]),
  boardingType: z.enum(["DAY", "BOARDING", "DAY_AND_BOARDING", "UNKNOWN"]),
  county: z.literal("Kilifi"),
  subCounty: z.literal("Rabai"),
  ward: z.string().trim().optional(),
  location: z.string().trim().optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .or(z.literal(""))
    .optional(),
  latitude: z.string().trim().optional(),
  longitude: z.string().trim().optional(),
  sne: z.enum(["YES", "NO", "UNKNOWN"]),
  isActive: z.enum(["Active", "Inactive"]),
  dataConfidence: z.enum(["VERIFIED", "PARTIAL", "SECONDARY_SOURCE"]),
});
