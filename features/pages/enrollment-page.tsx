"use client";

import { useState } from "react";
import {
  BookOpen,
  Check,
  ChevronRight,
  Download,
  School,
  Users,
  X,
} from "lucide-react";
import { useAcademicYear } from "@/features/academic-years/academic-year-context";
import PageHeader from "@/features/ui/page-header";
import {
  enrollmentGradeBands,
  enrollmentGradeRows,
} from "@/seeders/enrollment";
import { rabaiSchools, rabaiSchoolYears } from "@/seeders/rabai-schools";

const sortedRabaiSchools = [...rabaiSchools].sort((a, b) =>
  a.displayName.localeCompare(b.displayName),
);

function getEnrollmentSchoolType(institutionType: string) {
  return institutionType === "JUNIOR_SECONDARY"
    ? "Junior"
    : institutionType === "SENIOR_SECONDARY"
      ? "Senior / Secondary"
      : "Primary";
}
export function GradeEnrollmentPage({
  grade,
  onBack,
}: {
  grade: string;
  onBack: () => void;
}) {
  const { currentAcademicYear } = useAcademicYear();
  const gradeType =
    grade === "Grade 7-9"
      ? "JUNIOR_SECONDARY"
      : grade === "Grade 10-13"
        ? "SENIOR_SECONDARY"
        : "PRIMARY";
  const schools = sortedRabaiSchools
    .filter((school) => school.institutionType === gradeType)
    .map((school) => {
      const year = rabaiSchoolYears.find(
        (record) =>
          record.schoolId === school.id &&
          record.academicYearId === currentAcademicYear.id,
      );
      const learners = year?.studentCount ?? 0;
      const boys = Math.round(learners * 0.51);
      return [school.displayName, boys, learners - boys] as const;
    });
  return (
    <div className="content">
      <div className="breadcrumbs profile-crumb">
        <button onClick={onBack}>Enrollment</button>
        <span>/</span>
        <span>{grade}</span>
      </div>
      <div className="grade-page-header">
        <div>
          <span className="eyebrow">Enrollment management</span>
          <h1>{grade} enrollment</h1>
          <p>
            School-level enrollment totals for {grade} -{" "}
            {currentAcademicYear.name}
          </p>
        </div>
        <div className="grade-page-actions">
          <button
            className="outline-button"
            onClick={() => window.alert(`Export prepared for ${grade}`)}
          >
            <Download /> Export
          </button>
        </div>
      </div>
      <section className="panel grade-enrollment-panel">
        <div className="panel-header grade-table-header">
          <div className="grade-table-title">
            <span className="grade-table-icon">
              <School />
            </span>
            <div>
              <span className="eyebrow">Selected grade stream</span>
              <h2>Schools by grade</h2>
              <p>
                {schools.length} schools reporting <i /> Boys, girls, and total
                learners
              </p>
            </div>
          </div>
          <div className="grade-table-summary">
            <span>
              <strong>{schools.length}</strong>
              <small>Schools</small>
            </span>
            <span>
              <strong>
                {schools.reduce((sum, row) => sum + Number(row[1]), 0)}
              </strong>
              <small>Boys</small>
            </span>
            <span>
              <strong>
                {schools.reduce((sum, row) => sum + Number(row[2]), 0)}
              </strong>
              <small>Girls</small>
            </span>
            <span className="grade-total-badge">
              <strong>
                {schools.reduce(
                  (sum, row) => sum + Number(row[1]) + Number(row[2]),
                  0,
                )}
              </strong>
              <small>Total</small>
            </span>
          </div>
        </div>
        <div className="grade-school-table">
          <div className="grade-school-head">
            <span>School</span>
            <span>Boys</span>
            <span>Girls</span>
            <span>Total learners</span>
          </div>
          {schools.map(([school, boys, girls]) => (
            <div className="grade-school-row" key={school}>
              <strong>{school}</strong>
              <span>{boys}</span>
              <span>{girls}</span>
              <b>{Number(boys) + Number(girls)}</b>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function EnrollmentContent({
  onDetail,
  onGradeSelect,
}: {
  onDetail?: (item: string) => void;
  onGradeSelect?: (grade: string) => void;
}) {
  const { currentAcademicYear } = useAcademicYear();
  const [schoolType, setSchoolType] = useState("All schools");
  const [term, setTerm] = useState("Term 1");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const bands =
    enrollmentGradeBands[schoolType as keyof typeof enrollmentGradeBands];
  const enrollmentRows = sortedRabaiSchools.map((school) => {
    const year = rabaiSchoolYears.find(
      (record) =>
        record.schoolId === school.id &&
        record.academicYearId === currentAcademicYear.id,
    );

    return {
      school: school.displayName,
      type: getEnrollmentSchoolType(school.institutionType),
      total: year?.studentCount ?? 0,
      updated: currentAcademicYear.name,
    };
  });
  const filteredEnrollmentRows = enrollmentRows.filter(
    (row) => schoolType === "All schools" || row.type === schoolType,
  );
  const toggleGrade = (label: string) =>
    setSelectedGrades((current) =>
      current.includes(label)
        ? current.filter((grade) => grade !== label)
        : [...current, label],
    );
  const visibleGrades = selectedGrades.length
    ? bands.filter((band) => selectedGrades.includes(band.label))
    : bands;
  return (
    <div className="content">
      <PageHeader
        title="Enrollment"
        description="Capture and review learner enrollment by school, grade and term"
        eyebrow="Education Management / Enrollment"
      />
      <div className="enrollment-toolbar">
        <div>
          <span className="eyebrow">{currentAcademicYear.name}</span>
          <h2>Enrollment coverage</h2>
          <p>Every school reports learners across the correct grade band.</p>
        </div>
        <div className="enrollment-filters">
          <select
            value={schoolType}
            onChange={(e) => setSchoolType(e.target.value)}
          >
            <option>All schools</option>
            <option>Primary</option>
            <option>Junior</option>
            <option>Senior / Secondary</option>
          </select>
          <select value={term} onChange={(e) => setTerm(e.target.value)}>
            <option>Term 1</option>
            <option>Term 2</option>
            <option>Term 3</option>
          </select>
        </div>
      </div>
      <div className="grade-band-grid">
        {bands.map((band) => (
          <button
            type="button"
            className={`grade-band-card ${band.tone} ${selectedGrades.includes(band.label) ? "selected" : ""}`}
            key={band.label}
            onClick={() => onGradeSelect?.(band.label)}
            aria-pressed={selectedGrades.includes(band.label)}
          >
            <span className="grade-band-icon">
              <BookOpen />
            </span>
            <span className="grade-band-copy">
              <strong>{band.label}</strong>
              <span>{band.grades}</span>
            </span>
            <b>{band.count}</b>
            <span className="grade-select-indicator">
              {selectedGrades.includes(band.label) ? "Selected" : "Select"}
            </span>
          </button>
        ))}
      </div>
      <section className="panel enrollment-panel">
        <div className="panel-header">
          <div>
            <h2>School enrollment register</h2>
            <p>
              {term} - {currentAcademicYear.name} - {schoolType}
            </p>
          </div>
          <button
            className="outline-button"
            onClick={() => window.alert("Enrollment export prepared")}
          >
            <Download /> Export
          </button>
        </div>
        <div className="enrollment-table">
          <div className="enrollment-table-head">
            <span>School</span>
            <span>School type</span>
            <span>Coverage</span>
            <span className="enrollment-total">Learners</span>
            <span>Updated</span>
            <span />
          </div>
          {filteredEnrollmentRows.map((row) => (
            <button
              className="enrollment-row"
              key={row.school}
              onClick={() => onDetail?.(row.school)}
            >
              <span className="enrollment-school">
                <span className="school-mini-icon">
                  <School />
                </span>
                <strong>{row.school}</strong>
              </span>
              <span>{row.type}</span>
              <span className="coverage-pills">
                {(row.type === "Primary"
                  ? bands.filter(
                      (band) =>
                        band.label === "PP1-PP3" || band.label === "Grade 1-6",
                    )
                  : row.type === "Junior"
                    ? bands.filter((band) => band.label === "Grade 7-9")
                    : bands.filter((band) => band.label === "Grade 10-13")
                ).map((band) => (
                  <i key={band.label}>{band.label}</i>
                ))}
              </span>
              <strong className="enrollment-total">
                {row.total.toLocaleString()}
              </strong>
              <span>{row.updated}</span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export function EnrollmentGradeTable({
  school,
  term = "Term 1",
}: {
  school: string;
  term?: string;
}) {
  const schoolType = school.includes("Junior")
    ? "Junior"
    : school.includes("Senior") || school.includes("Secondary")
      ? "Senior / Secondary"
      : "Primary";
  const allRows = enrollmentGradeRows;
  const initialRows =
    schoolType === "Primary"
      ? allRows.slice(0, 9)
      : schoolType === "Junior"
        ? allRows.slice(9, 12)
        : allRows.slice(12);
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ male: number; female: number }>({
    male: 0,
    female: 0,
  });
  const startEdit = (grade: string | number, male: number, female: number) => {
    setEditing(String(grade));
    setDraft({ male, female });
  };
  const cancelEdit = () => setEditing(null);
  const saveEdit = (grade: string | number) => {
    setRows(
      rows.map((row) =>
        row[0] === grade
          ? [row[0], draft.male, draft.female, draft.male + draft.female]
          : row,
      ),
    );
    setEditing(null);
  };
  return (
    <section className="panel enrollment-detail-panel">
      <div className="panel-header enrollment-detail-header">
        <div className="enrollment-detail-title">
          <span className="enrollment-detail-icon">
            <Users />
          </span>
          <div>
            <h2>Enrollment by grade</h2>
            <p>
              {school} · Academic year 2026 · {term}
            </p>
          </div>
        </div>
        <div className="enrollment-detail-summary">
          <span>
            <strong>
              {rows.reduce((sum, row) => sum + Number(row[3]), 0)}
            </strong>
            <small>Total learners</small>
          </span>
          <span>
            <strong>{rows.length}</strong>
            <small>Grade levels</small>
          </span>
        </div>
      </div>
      <div className="detail-enrollment-table">
        <div className="detail-enrollment-head">
          <span>Grade</span>
          <span>Male</span>
          <span>Female</span>
          <span>Total learners</span>
        </div>
        {rows.map(([grade, male, female, total]) => (
          <div
            className={`detail-enrollment-row ${editing === grade ? "is-editing" : ""}`}
            key={grade}
          >
            <strong>{grade}</strong>
            {editing === grade ? (
              <>
                <input
                  className="grade-number-input"
                  type="number"
                  min="0"
                  value={draft.male}
                  onChange={(e) =>
                    setDraft({ ...draft, male: Number(e.target.value) })
                  }
                  aria-label={`${grade} male learners`}
                />
                <input
                  className="grade-number-input"
                  type="number"
                  min="0"
                  value={draft.female}
                  onChange={(e) =>
                    setDraft({ ...draft, female: Number(e.target.value) })
                  }
                  aria-label={`${grade} female learners`}
                />
                <span className="grade-edit-actions">
                  <button
                    onClick={() => saveEdit(grade)}
                    aria-label={`Save ${grade}`}
                    className="grade-save"
                  >
                    <Check />
                  </button>
                  <button
                    onClick={cancelEdit}
                    aria-label={`Cancel ${grade}`}
                    className="grade-cancel"
                  >
                    <X />
                  </button>
                </span>
              </>
            ) : (
              <>
                <button
                  className="grade-number-button"
                  onClick={() => startEdit(grade, Number(male), Number(female))}
                >
                  {male}
                </button>
                <button
                  className="grade-number-button"
                  onClick={() => startEdit(grade, Number(male), Number(female))}
                >
                  {female}
                </button>
                <b>{total}</b>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default EnrollmentContent;
