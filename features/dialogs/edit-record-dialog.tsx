"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { editRecordSchema } from "@/features/schemas/edit-record-schema";
import { editSchoolRecordSchema } from "@/features/schemas/edit-school-record-schema";
import { editWardRecordSchema } from "@/features/schemas/edit-ward-record-schema";
import type {
  EditRecordFormValues,
  EditSchoolRecordFormValues,
  EditWardRecordFormValues,
} from "@/features/types/forms";
import {
  getRabaiWardInfo,
  rabaiSchools,
  rabaiWards,
} from "@/seeders/rabai-schools";
import { staffRecords } from "@/seeders/staff";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";

type EditField = {
  label: string;
  name: string;
  kind?: "input" | "select";
};

export function EditRecordDialog({
  active,
  item,
  onClose,
}: {
  active: string;
  item: string;
  onClose: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const wardInfo = active === "Ward" ? getRabaiWardInfo(item) : null;
  const schoolInfo =
    active === "Schools"
      ? (rabaiSchools.find(
          (school) =>
            school.displayName === item ||
            school.officialName === item ||
            school.schoolCode === item,
        ) ?? rabaiSchools[0])
      : null;
  const staffInfo =
    active === "Staff"
      ? staffRecords.find((record) => record.name === item)
      : null;
  const staffIndex =
    active === "Staff"
      ? staffRecords.findIndex((record) => record.name === item)
      : -1;
  const fields: EditField[] =
    active === "Schools"
      ? [
          { label: "School code", name: "schoolCode" },
          { label: "UIC code", name: "uicCode" },
          { label: "KNEC code", name: "knecCode" },
          { label: "TSC code", name: "tscCode" },
          { label: "Registration number", name: "regNumber" },
          { label: "Official school name", name: "officialName" },
          { label: "Display name", name: "displayName" },
          { label: "Institution type", name: "institutionType" },
          { label: "Source institution type", name: "sourceInstitutionType" },
          { label: "Registration status", name: "registrationStatus" },
          { label: "Level", name: "level" },
          { label: "Ownership", name: "ownershipType" },
          { label: "Gender", name: "genderType" },
          { label: "Boarding", name: "boardingType" },
          { label: "Title deed", name: "titleDeed" },
          { label: "County", name: "county" },
          { label: "Sub-County", name: "subCounty" },
          { label: "Ward", name: "ward" },
          { label: "Location", name: "location" },
          { label: "Address", name: "address" },
          { label: "Phone", name: "phone" },
          { label: "Email", name: "email" },
          { label: "Latitude", name: "latitude" },
          { label: "Longitude", name: "longitude" },
          { label: "SNE", name: "sne" },
          { label: "Status", name: "isActive" },
          { label: "Data confidence", name: "dataConfidence" },
        ]
      : active === "Staff"
        ? [
            "Full name",
            "Designation",
            "Assigned school",
            "Employment type",
            "Employer",
            "TSC No.",
            "Email address",
            "Phone number",
            "Date joined",
          ].map((label) => ({ label, name: label }))
        : active === "Enrollment"
          ? [
              "School",
              "Academic year",
              "Term",
              "Grade",
              "Male learners",
              "Female learners",
            ].map((label) => ({ label, name: label }))
          : active === "Infrastructure"
            ? [
                "School",
                "Classrooms",
                "Good condition",
                "Needs repair",
                "Electricity",
                "Water",
              ].map((label) => ({ label, name: label }))
            : active === "School Contacts"
              ? ["School", "Contact name", "Role", "Phone", "Email"].map(
                  (label) => ({ label, name: label }),
                )
              : active === "Ward"
                ? [
                    { label: "Ward name", name: "wardName" },
                    { label: "Ward code", name: "wardCode" },
                    { label: "County", name: "county" },
                    { label: "County code", name: "countyCode" },
                    { label: "Sub-County", name: "subCounty" },
                    { label: "Sub-County code", name: "subCountyCode" },
                    { label: "Constituency", name: "constituency" },
                    { label: "Constituency code", name: "constituencyCode" },
                  ]
                : ["Report type", "Reporting period", "Description"].map(
                    (label) => ({ label, name: label }),
                  );

  const getDefaultValue = (field: EditField) => {
    if (active === "Schools" && schoolInfo) {
      const level =
        schoolInfo.institutionType === "JUNIOR_SECONDARY"
          ? "Junior_Secondary"
          : schoolInfo.institutionType === "SENIOR_SECONDARY"
            ? "Senior_School"
            : "Primary";
      const values: Record<string, string> = {
        schoolCode: schoolInfo.schoolCode ?? "",
        uicCode: schoolInfo.uicCode ?? "",
        knecCode: "",
        tscCode: "",
        regNumber: "",
        officialName: schoolInfo.officialName,
        displayName: schoolInfo.displayName,
        institutionType: schoolInfo.institutionType,
        sourceInstitutionType: schoolInfo.sourceInstitutionType ?? "",
        registrationStatus: "REGISTERED",
        level,
        ownershipType: schoolInfo.ownershipType,
        genderType: schoolInfo.genderType,
        boardingType: schoolInfo.boardingType,
        titleDeed: "NO",
        county: schoolInfo.county,
        subCounty: schoolInfo.subCounty,
        ward: schoolInfo.ward ?? "",
        location: schoolInfo.location ?? "",
        address: schoolInfo.address ?? "",
        phone: schoolInfo.phone ?? "",
        email: schoolInfo.email ?? "",
        latitude: String(schoolInfo.latitude ?? ""),
        longitude: String(schoolInfo.longitude ?? ""),
        sne: schoolInfo.sne,
        isActive: schoolInfo.isActive ? "Active" : "Inactive",
        dataConfidence: schoolInfo.dataConfidence,
      };

      return values[field.name] ?? "";
    }

    if (active === "Ward") {
      const values: Record<string, string> = {
        wardName: wardInfo?.wardName ?? item,
        wardCode: wardInfo?.wardCode ?? "",
        county: wardInfo?.county ?? "Kilifi",
        countyCode: wardInfo?.countyCode ?? "003",
        subCounty: wardInfo?.subCounty ?? "Rabai",
        subCountyCode: wardInfo?.subCountyCode ?? "014",
        constituency: wardInfo?.constituency ?? "Rabai",
        constituencyCode: wardInfo?.constituencyCode ?? "014",
      };

      return values[field.name] ?? "";
    }

    if (active === "Staff") {
      const staffEmail = staffInfo
        ? `${staffInfo.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ".")
            .replace(/^\.+|\.+$/g, "")}@school.example`
        : "";
      const values: Record<string, string> = {
        "Full name": staffInfo?.name ?? item,
        Designation: staffInfo?.role ?? "Teacher",
        "Assigned school": "Mwangaza Primary School",
        "Employment type": "Permanent",
        Employer: "Goverment_Tsc",
        "TSC No.":
          staffIndex >= 0
            ? `TSC-${String(staffIndex + 12).padStart(4, "0")}`
            : "",
        "Email address": staffEmail,
        "Phone number": staffInfo?.phone ?? "",
        "Date joined": "2023-01-15",
      };

      return values[field.label] ?? "";
    }

    return field.label === "School" || field.label === "Assigned school"
      ? item
      : field.label === "Full name"
        ? item
        : field.label === "Academic year"
          ? "2026"
          : field.label === "Male learners"
            ? "32"
            : field.label === "Female learners"
              ? "29"
              : field.label === "Term"
                ? "Term 1"
                : field.label === "Employment type"
                  ? "Permanent"
                  : field.label === "Status"
                    ? "Active"
                    : field.label === "Ward"
                      ? item
                      : "";
  };

  const { register, handleSubmit } = useForm<
    EditRecordFormValues | EditSchoolRecordFormValues | EditWardRecordFormValues
  >({
    resolver: zodResolver(
      active === "Schools"
        ? editSchoolRecordSchema
        : active === "Ward"
          ? editWardRecordSchema
          : editRecordSchema,
    ),
    defaultValues: {
      fields: Object.fromEntries(
        fields.map((field) => [field.name, getDefaultValue(field)]),
      ),
    },
  });
  const schoolSelectOptions: Record<
    string,
    { label: string; value: string }[]
  > = {
    institutionType: [
      { label: "Primary", value: "PRIMARY" },
      { label: "Junior secondary", value: "JUNIOR_SECONDARY" },
      { label: "Senior secondary", value: "SENIOR_SECONDARY" },
      { label: "Integrated", value: "INTEGRATED" },
      { label: "Other", value: "OTHER" },
    ],
    registrationStatus: [
      { label: "Registered", value: "REGISTERED" },
      { label: "Pending", value: "PENDING" },
      { label: "Suspended", value: "SUSPENDED" },
      { label: "Closed", value: "CLOSED" },
    ],
    level: [
      { label: "Primary", value: "Primary" },
      { label: "Junior Secondary", value: "Junior_Secondary" },
      { label: "Senior School", value: "Senior_School" },
    ],
    ownershipType: [
      { label: "Public", value: "PUBLIC" },
      { label: "Private", value: "PRIVATE" },
      { label: "Faith based", value: "FAITH_BASED" },
      { label: "Other", value: "OTHER" },
      { label: "Unknown", value: "UNKNOWN" },
    ],
    genderType: [
      { label: "Mixed", value: "MIXED" },
      { label: "Boys", value: "BOYS" },
      { label: "Girls", value: "GIRLS" },
      { label: "Unknown", value: "UNKNOWN" },
    ],
    boardingType: [
      { label: "Day", value: "DAY" },
      { label: "Boarding", value: "BOARDING" },
      { label: "Day and boarding", value: "DAY_AND_BOARDING" },
      { label: "Unknown", value: "UNKNOWN" },
    ],
    titleDeed: [
      { label: "No", value: "NO" },
      { label: "Yes", value: "YES" },
    ],
    county: [{ label: "Kilifi", value: "Kilifi" }],
    subCounty: [{ label: "Rabai", value: "Rabai" }],
    ward: [
      { label: "Not mapped", value: "" },
      ...rabaiWards.map((ward) => ({
        label: ward.wardName,
        value: ward.wardName,
      })),
    ],
    sne: [
      { label: "No", value: "NO" },
      { label: "Yes", value: "YES" },
      { label: "Unknown", value: "UNKNOWN" },
    ],
    isActive: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
    dataConfidence: [
      { label: "Verified", value: "VERIFIED" },
      { label: "Partial", value: "PARTIAL" },
      { label: "Secondary source", value: "SECONDARY_SOURCE" },
    ],
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="form-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-head">
          <div>
            <span className="eyebrow">{active} management</span>
            <h2>Edit {active === "Reports" ? "report" : "record"}</h2>
            <p>
              Update the official record and save it to the local sync queue.
            </p>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close edit form"
          >
            <X />
          </button>
        </div>
        {saved ? (
          <div className="success-state">
            <div>
              <Check />
            </div>
            <h3>Changes saved locally</h3>
            <p>The updated record is queued for synchronization.</p>
            <button className="outline-button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(() => setSaved(true))}>
            <div className="form-section">
              <h3>Record information</h3>
              <div className="form-grid">
                {fields.map((field) => (
                  <label key={field.name}>
                    {field.label}
                    {active === "Schools" && schoolSelectOptions[field.name] ? (
                      <select {...register(`fields.${field.name}`)}>
                        {schoolSelectOptions[field.name].map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.label === "Term" ||
                      field.label === "Employment type" ||
                      field.label === "Employer" ||
                      field.label === "Status" ? (
                      <select {...register(`fields.${field.name}`)}>
                        {field.label === "Term" ? (
                          <>
                            <option>Term 1</option>
                            <option>Term 2</option>
                            <option>Term 3</option>
                          </>
                        ) : field.label === "Employment type" ? (
                          <>
                            <option>Permanent</option>
                            <option>Contract</option>
                            <option>Temporary</option>
                          </>
                        ) : field.label === "Employer" ? (
                          <>
                            <option value="Goverment_Tsc">
                              Government (TSC)
                            </option>
                            <option value="County_Goverment">
                              County Government
                            </option>
                            <option value="School_Board_Bom">
                              School Board (BOM)
                            </option>
                            <option value="PRIVATE_OWNER">Private Owner</option>
                            <option value="FAITH_BASED">
                              Faith Based Organization
                            </option>
                            <option value="NGO">NGO</option>
                            <option value="AGENCY">Agency</option>
                          </>
                        ) : active === "Ward" ? (
                          <>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Under review</option>
                          </>
                        ) : (
                          <>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Update needed</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <input
                        {...register(`fields.${field.name}`)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div className="dialog-footer">
              <button
                className="outline-button"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <Button className="modal-primary-button" type="submit">
                Save changes
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
