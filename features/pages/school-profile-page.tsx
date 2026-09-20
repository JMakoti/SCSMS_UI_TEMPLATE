"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAcademicYear } from "@/features/academic-years/academic-year-context";
import {
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  Download,
  Info,
  Pencil,
  Plus,
  School,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import { ConfirmDeleteDialog } from "@/features/ui/confirm-delete-dialog";
import StatusBadge from "@/features/ui/status-badge";
import SchoolContactsContent from "@/features/pages/contacts-page";
import InfrastructureContent from "@/features/pages/infrastructure-page";
import { EnrollmentGradeTable } from "@/features/pages/enrollment-page";
import { StaffContent } from "@/features/pages/staff-page";
import { rabaiSchools, rabaiSchoolYears } from "@/seeders/rabai-schools";
import { schoolHistoryActivities } from "@/seeders/profile";

const displayValue = (value: string | number | null | undefined) =>
  value !== null && value !== undefined && String(value).trim()
    ? String(value)
    : "Not provided";

const formatSchoolValue = (value: string | null | undefined) =>
  displayValue(value?.replaceAll("_", " "));

export function SchoolHistoryContent({ schoolName }: { schoolName: string }) {
  const activityIcons = { Pencil, Building2, UserCog, Users };
  const activities = schoolHistoryActivities;
  return (
    <section className="panel school-history-panel">
      <div className="panel-header">
        <div>
          <h2>School activity history</h2>
          <p>{schoolName} - Activity recorded for this school only</p>
        </div>
      </div>
      <div className="school-history-list">
        {activities.map((activity) => (
          <div className="school-history-row" key={activity.title}>
            <span className="school-history-icon">
              {(() => {
                const Icon = activityIcons[activity.icon];
                return <Icon />;
              })()}
            </span>
            <div>
              <strong>{activity.title}</strong>
              <span>{activity.detail}</span>
            </div>
            <time>{activity.time}</time>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SchoolProfile({
  schoolId,
  onBack,
}: {
  schoolId: string;
  onBack: () => void;
}) {
  const [tab, setTab] = useState("Overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [term, setTerm] = useState("Term 1");
  const { currentAcademicYear } = useAcademicYear();
  const school =
    rabaiSchools.find((record) => record.id === schoolId) ?? rabaiSchools[0];
  const yearRecord = rabaiSchoolYears.find(
    (record) =>
      record.schoolId === school.id &&
      record.academicYearId === currentAcademicYear.id,
  );
  const totalGenderLearners = yearRecord?.studentCount ?? 0;
  const maleLearners = Math.round(totalGenderLearners * 0.51);
  const femaleLearners = totalGenderLearners - maleLearners;
  const maleShare = totalGenderLearners
    ? Math.round((maleLearners / totalGenderLearners) * 100)
    : 0;
  const genderDistribution = [
    { label: "Male", value: maleLearners, tone: "male" },
    { label: "Female", value: femaleLearners, tone: "female" },
  ];
  const completenessFields = [
    school.schoolCode,
    school.uicCode,
    school.officialName,
    school.displayName,
    school.institutionType,
    school.ownershipType,
    school.genderType,
    school.boardingType,
    school.ward,
    school.location,
    school.address,
    school.phone,
    school.email,
    school.latitude,
    school.longitude,
  ];
  const completeness = Math.round(
    (completenessFields.filter(
      (value) => value !== null && value !== undefined && String(value).trim(),
    ).length /
      completenessFields.length) *
      100,
  );
  const coordinates =
    school.latitude !== null && school.longitude !== null
      ? `${school.latitude}, ${school.longitude}`
      : "Not provided";
  return (
    <div className={`content ${tab === "Staff" ? "school-profile-staff" : ""}`}>
      {showDeleteModal && (
        <ConfirmDeleteDialog
          item={school.displayName}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={onBack}
        />
      )}
      <div className="breadcrumbs profile-crumb">
        <button onClick={onBack}>Schools</button>
        <span>/</span>
        <span>{school.displayName}</span>
      </div>
      <div className="profile-head">
        <div className="profile-title">
          <div className="profile-school-icon">
            <School />
          </div>
          <div>
            <div className="profile-code">
              {displayValue(school.schoolCode)}
            </div>
            <h1>{school.displayName}</h1>
            <div className="profile-sub">
              <span>{formatSchoolValue(school.institutionType)}</span>
              <i /> <span>{formatSchoolValue(school.ownershipType)}</span>
              <i />{" "}
              <StatusBadge status={school.isActive ? "Active" : "Inactive"} />
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="outline-button">
            <Download /> Export
          </button>
          <Button
            className="edit-school-button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("scsms-edit-record", {
                  detail: {
                    active: "Schools",
                    item: school.displayName,
                  },
                }),
              )
            }
          >
            <Pencil data-icon="inline-start" />
            Edit School
          </Button>
          <button
            className="danger-button"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 />
            Delete
          </button>
        </div>
      </div>
      <div className="profile-tabs">
        {[
          "Overview",
          "Contacts",
          "Enrollment",
          "Staff",
          "Infrastructure",
          "History",
        ].map((x) => (
          <button
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
            key={x}
          >
            {x}
            {x === "Contacts" && <span>3</span>}
          </button>
        ))}
      </div>
      {tab === "Contacts" ? (
        <SchoolContactsContent school={school.displayName} />
      ) : tab === "History" ? (
        <SchoolHistoryContent schoolName={school.displayName} />
      ) : tab === "Staff" ? (
        <StaffContent variant="school-profile" />
      ) : tab === "Infrastructure" ? (
        <InfrastructureContent detail school={school.displayName} />
      ) : tab === "Enrollment" ? (
        <div className="enrollment-tab-content">
          <div className="term-cards">
            {["Term 1", "Term 2", "Term 3"].map((termName) => (
              <button
                key={termName}
                className={`term-card ${term === termName ? "active" : ""}`}
                onClick={() => setTerm(termName)}
              >
                <span className="term-card-check">
                  {term === termName ? "✓" : ""}
                </span>
                <span>
                  <strong>{termName}</strong>
                  <small>{currentAcademicYear.name}</small>
                </span>
                <b>{term === termName ? "Current" : "Select"}</b>
              </button>
            ))}
          </div>
          <EnrollmentGradeTable school={school.displayName} term={term} />
        </div>
      ) : tab === "Overview" ? (
        <div className="profile-grid">
          <section className="panel detail-panel">
            <div className="panel-header">
              <div>
                <h2>School information</h2>
                <p>Official registry details</p>
              </div>
              <button className="icon-button">
                <Pencil />
              </button>
            </div>
            <dl className="detail-list">
              <div>
                <dt>School code</dt>
                <dd>{displayValue(school.schoolCode)}</dd>
              </div>
              <div>
                <dt>Official name</dt>
                <dd>{school.officialName}</dd>
              </div>
              <div>
                <dt>Display name</dt>
                <dd>{school.displayName}</dd>
              </div>
              <div>
                <dt>Institution type</dt>
                <dd>{formatSchoolValue(school.institutionType)}</dd>
              </div>
              <div>
                <dt>Ownership</dt>
                <dd>
                  <span className="type-label">
                    <span
                      className={`type-dot ${school.ownershipType.toLowerCase()}`}
                    />
                    {formatSchoolValue(school.ownershipType)}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Gender</dt>
                <dd>{formatSchoolValue(school.genderType)}</dd>
              </div>
              <div>
                <dt>Boarding</dt>
                <dd>{formatSchoolValue(school.boardingType)}</dd>
              </div>
              <div>
                <dt>SNE</dt>
                <dd>{formatSchoolValue(school.sne)}</dd>
              </div>
              <div>
                <dt>Data confidence</dt>
                <dd>{formatSchoolValue(school.dataConfidence)}</dd>
              </div>
            </dl>
          </section>
          <section className="panel detail-panel">
            <div className="panel-header">
              <div>
                <h2>Location</h2>
                <p>Administrative location details</p>
              </div>
              <button className="icon-button">
                <Pencil />
              </button>
            </div>
            <dl className="detail-list">
              <div>
                <dt>County</dt>
                <dd>{school.county}</dd>
              </div>
              <div>
                <dt>Sub-County</dt>
                <dd>{school.subCounty}</dd>
              </div>
              <div>
                <dt>Ward</dt>
                <dd>{displayValue(school.ward)}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{displayValue(school.location)}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{displayValue(school.address)}</dd>
              </div>
              <div>
                <dt>Coordinates</dt>
                <dd>{coordinates}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{displayValue(school.phone)}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{displayValue(school.email)}</dd>
              </div>
            </dl>
          </section>
          <section className="panel stats-detail">
            <div className="panel-header">
              <div>
                <h2>Current statistics</h2>
                <p>Latest reported figures</p>
              </div>
              <span className="as-of">{currentAcademicYear.name}</span>
            </div>
            <div className="detail-stat-grid">
              <div>
                <Users />
                <strong>{totalGenderLearners.toLocaleString()}</strong>
                <span>Students</span>
              </div>
              <div>
                <UserCog />
                <strong>
                  {(yearRecord?.teacherCount ?? 0).toLocaleString()}
                </strong>
                <span>Teaching staff</span>
              </div>
              <div>
                <Users />
                <strong>
                  {formatSchoolValue(school.sourceInstitutionType)}
                </strong>
                <span>Source type</span>
              </div>
              <div>
                <Building2 />
                <strong>
                  {(yearRecord?.classCount ?? 0).toLocaleString()}
                </strong>
                <span>Classrooms</span>
              </div>
            </div>
          </section>
          <div className="profile-insight-row">
            <section className="panel gender-detail">
              <div className="panel-header">
                <div>
                  <h2>Gender distribution</h2>
                  <p>Current learner count by gender</p>
                </div>
                <span className="quality-value">{totalGenderLearners}</span>
              </div>
              <div className="gender-chart-wrap">
                <div
                  className="gender-donut"
                  style={{
                    background: `conic-gradient(#2563eb 0 ${maleShare}%, #38bdf8 ${maleShare}% 100%)`,
                  }}
                  aria-label={`Gender distribution: ${maleShare}% male and ${100 - maleShare}% female`}
                >
                  <div>
                    <strong>{maleShare}%</strong>
                    <span>male</span>
                  </div>
                </div>
                <div className="gender-legend">
                  {genderDistribution.map((item) => (
                    <span key={item.label}>
                      <i className={`gender-${item.tone}`} />
                      {item.label}
                      <b>{item.value}</b>
                    </span>
                  ))}
                </div>
              </div>
            </section>
            <section className="panel completeness-detail">
              <div className="panel-header">
                <div>
                  <h2>Data completeness</h2>
                  <p>Profile information quality</p>
                </div>
                <span className="quality-value">{completeness}%</span>
              </div>
              <div className="progress">
                <span style={{ width: `${completeness}%` }} />
              </div>
              <div className="quality-breakdown">
                <span>
                  <Check /> Basic information
                </span>
                <span>
                  <Check /> Location
                </span>
                <span>
                  <Check /> Enrollment
                </span>
                <span className="missing">
                  <Info /> Infrastructure (1 missing)
                </span>
              </div>
              <button className="text-button">
                Review missing data <ChevronRight />
              </button>
            </section>
          </div>
        </div>
      ) : (
        <div className="panel tab-placeholder">
          <div className="empty-state">
            <ClipboardCheck />
            <strong>{tab} records</strong>
            <span>
              This section is ready for {tab.toLowerCase()} data management.
            </span>
            <Button>
              <Plus data-icon="inline-start" />
              Add {tab.slice(0, -1)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolProfile;
