"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { addContactSchema } from "@/features/schemas/add-contact-schema";
import { addSchoolSchema } from "@/features/schemas/add-school-schema";
import type {
  AddContactFormValues,
  AddSchoolFormValues,
} from "@/features/types/forms";
import { rabaiSchools, rabaiWards } from "@/seeders/rabai-schools";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
export function AddContactDialog({ onClose }: { onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit } = useForm<AddContactFormValues>({
    resolver: zodResolver(addContactSchema),
    defaultValues: { school: "", role: "Head teacher", status: "Active" },
  });
  return (
    <div className="overlay" onClick={onClose}>
      <div className="form-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="dialog-head">
          <div>
            <span className="eyebrow">Contact management</span>
            <h2>Add contact</h2>
            <p>Create a contact record and assign it to a school.</p>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close add contact form"
          >
            <X />
          </button>
        </div>
        {saved ? (
          <div className="success-state">
            <div>
              <Check />
            </div>
            <h3>Contact saved locally</h3>
            <p>The contact has been added to the synchronization queue.</p>
            <button className="outline-button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(() => setSaved(true))}>
            <div className="form-section">
              <h3>Contact details</h3>
              <div className="form-grid">
                <label>
                  School
                  <select {...register("school")}>
                    <option value="" disabled>
                      Select a school
                    </option>
                    {[...rabaiSchools]
                      .sort((a, b) =>
                        a.displayName.localeCompare(b.displayName),
                      )
                      .map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.displayName} -{" "}
                          {school.schoolCode ?? "No code"}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Contact role
                  <select {...register("role")}>
                    <option>Head teacher</option>
                    <option>Deputy head teacher</option>
                    <option>School bursar</option>
                    <option>School secretary</option>
                  </select>
                </label>
                <label>
                  Full name
                  <input
                    {...register("fullName")}
                    placeholder="Enter full name"
                    autoFocus
                  />
                </label>
                <label>
                  Email address
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@example.com"
                  />
                </label>
                <label>
                  Phone number
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+254 700 000 000"
                  />
                </label>
                <label>
                  Status
                  <select {...register("status")}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
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
              <button className="modal-primary-button" type="submit">
                Save contact
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function AddSchoolDialog({ onClose }: { onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit } = useForm<AddSchoolFormValues>({
    resolver: zodResolver(addSchoolSchema),
    defaultValues: {
      institutionType: "PRIMARY",
      ownershipType: "PUBLIC",
      genderType: "MIXED",
      boardingType: "DAY",
      county: "Kilifi",
      subCounty: "Rabai",
      ward: "Mwawesa",
      sne: "NO",
      isActive: "Active",
      dataConfidence: "VERIFIED",
    },
  });
  return (
    <div className="overlay" onClick={onClose}>
      <div className="form-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-head">
          <div>
            <span className="eyebrow">School management</span>
            <h2>Add new school</h2>
            <p>Create an official school registry record</p>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X />
          </button>
        </div>
        {saved ? (
          <div className="success-state">
            <div>
              <Check />
            </div>
            <h3>School saved locally</h3>
            <p>
              The record has been saved and added to the synchronization queue.
            </p>
            <button className="outline-button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(() => setSaved(true))}>
            <div className="form-section">
              <h3>Basic information</h3>
              <div className="form-grid">
                <label>
                  School code
                  <input {...register("schoolCode")} placeholder="Optional" />
                </label>
                <label>
                  UIC code
                  <input {...register("uicCode")} placeholder="Optional" />
                </label>
                <label>
                  Official school name
                  <input
                    {...register("officialName")}
                    placeholder="Enter official school name"
                    autoFocus
                  />
                </label>
                <label>
                  Display name
                  <input
                    {...register("displayName")}
                    placeholder="Enter display name"
                  />
                </label>
                <label>
                  Institution type
                  <select {...register("institutionType")}>
                    <option value="PRIMARY">Primary</option>
                    <option value="JUNIOR_SECONDARY">Junior secondary</option>
                    <option value="SENIOR_SECONDARY">Senior secondary</option>
                    <option value="INTEGRATED">Integrated</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>
                <label>
                  Source institution type
                  <input
                    {...register("sourceInstitutionType")}
                    placeholder="Optional source type"
                  />
                </label>
                <label>
                  Ownership
                  <select {...register("ownershipType")}>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                    <option value="FAITH_BASED">Faith based</option>
                    <option value="OTHER">Other</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </label>
                <label>
                  Gender
                  <select {...register("genderType")}>
                    <option value="MIXED">Mixed</option>
                    <option value="BOYS">Boys</option>
                    <option value="GIRLS">Girls</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </label>
                <label>
                  Boarding
                  <select {...register("boardingType")}>
                    <option value="DAY">Day</option>
                    <option value="BOARDING">Boarding</option>
                    <option value="DAY_AND_BOARDING">Day and boarding</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="form-section">
              <h3>Location</h3>
              <div className="form-grid">
                <label>
                  County
                  <input {...register("county")} />
                </label>
                <label>
                  Sub-County
                  <input {...register("subCounty")} />
                </label>
                <label>
                  Ward
                  <select {...register("ward")}>
                    <option value="">Not mapped</option>
                    {rabaiWards.map((ward) => (
                      <option key={ward.wardCode} value={ward.wardName}>
                        {ward.wardName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Location
                  <input
                    {...register("location")}
                    placeholder="Enter location"
                  />
                </label>
                <label>
                  Address
                  <input {...register("address")} placeholder="P.O. Box..." />
                </label>
                <label>
                  Phone
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+254 700 000 000"
                  />
                </label>
                <label>
                  Email
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="school@example.com"
                  />
                </label>
                <label>
                  Latitude
                  <input {...register("latitude")} placeholder="-3.92" />
                </label>
                <label>
                  Longitude
                  <input {...register("longitude")} placeholder="39.56" />
                </label>
              </div>
            </div>
            <div className="form-section">
              <h3>Classification</h3>
              <div className="form-grid">
                <label>
                  SNE
                  <select {...register("sne")}>
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </label>
                <label>
                  Status
                  <select {...register("isActive")}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
                <label>
                  Data confidence
                  <select {...register("dataConfidence")}>
                    <option value="VERIFIED">Verified</option>
                    <option value="PARTIAL">Partial</option>
                    <option value="SECONDARY_SOURCE">Secondary source</option>
                  </select>
                </label>
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
              <button className="outline-button" type="submit">
                Save & Add Another
              </button>
              <Button className="modal-primary-button" type="submit">
                Save School
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* v0 Design System Showcase Page */
/* End-to-end UI prototype: mocked local data, interactive navigation, search, filters, dialogs, tabs and offline-safe status. */
