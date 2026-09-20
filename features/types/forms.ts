import type { z } from "zod";
import type { addContactSchema } from "@/features/schemas/add-contact-schema";
import type { addSchoolSchema } from "@/features/schemas/add-school-schema";
import type { addStaffSchema } from "@/features/schemas/add-staff-schema";
import type { addWardSchema } from "@/features/schemas/add-ward-schema";
import type { editRecordSchema } from "@/features/schemas/edit-record-schema";
import type { editSchoolRecordSchema } from "@/features/schemas/edit-school-record-schema";
import type { editWardRecordSchema } from "@/features/schemas/edit-ward-record-schema";
import type { infrastructureProjectSchema } from "@/features/schemas/infrastructure-project-schema";
import type { loginSchema } from "@/features/schemas/login-schema";
import type { profileSchema } from "@/features/schemas/profile-schema";

export type LoginFormValues = z.infer<typeof loginSchema>;
export type AddContactFormValues = z.infer<typeof addContactSchema>;
export type AddSchoolFormValues = z.infer<typeof addSchoolSchema>;
export type AddStaffFormValues = z.infer<typeof addStaffSchema>;
export type AddWardFormValues = z.infer<typeof addWardSchema>;
export type EditWardRecordFormValues = z.infer<typeof editWardRecordSchema>;
export type EditSchoolRecordFormValues = z.infer<typeof editSchoolRecordSchema>;
export type InfrastructureProjectFormValues = z.infer<
  typeof infrastructureProjectSchema
>;
export type EditRecordFormValues = z.infer<typeof editRecordSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
