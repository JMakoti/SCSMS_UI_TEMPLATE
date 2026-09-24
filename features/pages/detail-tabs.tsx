"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Database,
  Download,
  FileBarChart2,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  MapPin,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  School,
  Users,
} from "lucide-react";
import { useAcademicYear } from "@/features/academic-years/academic-year-context";
import StatusBadge from "@/features/ui/status-badge";
import SchoolContactsContent from "@/features/pages/contacts-page";
import InfrastructureContent from "@/features/pages/infrastructure-page";
import PerformanceContent, {
  getSchoolAssessment,
} from "@/features/pages/performance-page";
import { EnrollmentGradeTable } from "@/features/pages/enrollment-page";
import {
  getRabaiSchoolsByWard,
  rabaiSchoolYears,
} from "@/seeders/rabai-schools";
import { getReportDetail } from "@/seeders/reports";

function WardSchoolsTab({ ward }: { ward: string }) {
  const { currentAcademicYear } = useAcademicYear();
  const [searchQuery, setSearchQuery] = useState("");
  const wardSchools = getRabaiSchoolsByWard(ward);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSchools = normalizedQuery
    ? wardSchools.filter((school) =>
      [
        school.displayName,
        school.schoolCode,
        school.institutionType,
        school.ownershipType,
        school.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    )
    : wardSchools;

  return (
    <section className="panel module-table">
      <div className="panel-header">
        <div>
          <h2>Schools in {ward}</h2>
          <p>
            {filteredSchools.length} of {wardSchools.length} schools shown
          </p>
        </div>
        <div className="input-wrap compact-search">
          <Search />
          <input
            placeholder="Search records..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="module-rows">
        {filteredSchools.map((school) => {
          const yearRecord = rabaiSchoolYears.find(
            (record) =>
              record.schoolId === school.id &&
              record.academicYearId === currentAcademicYear.id,
          );

          return (
            <div className="module-row" key={school.id}>
              <div className="row-icon">
                <School />
              </div>
              <div className="row-main">
                <strong>{school.displayName}</strong>
                <span>
                  {school.schoolCode ?? "No code"} -{" "}
                  {school.institutionType.replaceAll("_", " ")} -{" "}
                  {school.ownershipType} -{" "}
                  {(yearRecord?.studentCount ?? 0).toLocaleString()} demo
                  learners - {(yearRecord?.teacherCount ?? 0).toLocaleString()}{" "}
                  demo teachers
                </span>
              </div>
              <StatusBadge status={school.isActive ? "Active" : "Inactive"} />
            </div>
          );
        })}
        {filteredSchools.length === 0 && (
          <div className="module-row">
            <div className="row-icon">
              <Search />
            </div>
            <div className="row-main">
              <strong>No schools found</strong>
              <span>
                Try a different school name, code, level, or ownership type.
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function getReportIcon(reportKey: string) {
  const icons = {
    "school-register": Building2,
    enrollment: GraduationCap,
    staff: Users,
    infrastructure: FileBarChart2,
    "ward-summary": MapPin,
    "school-type": FileSpreadsheet,
    "data-quality": AlertTriangle,

  };

  return icons[reportKey as keyof typeof icons] ?? FileText;
}

function getReportPreviewRows(reportKey: string) {
  const rows = {
    "school-register": [
      ["SCH-0001", "Mwangaza Primary School", "Primary", "Public", "Mvita"],
      ["SCH-0002", "Bahari Academy", "Primary", "Private", "Kisauni"],
      ["SCH-0003", "Kijani Secondary School", "Secondary", "Public", "Nyali"],
    ],
    enrollment: [
      ["Grade 1", "326", "316", "642"],
      ["Grade 2", "301", "294", "595"],
      ["Grade 3", "288", "279", "567"],
    ],
    staff: [
      ["STF-00012", "John Kamau", "Head Teacher", "Permanent", "Active"],
      ["STF-00017", "Grace Akinyi", "Teacher", "Permanent", "Active"],
      ["STF-00021", "Peter Otieno", "Clerk", "Contract", "Active"],
    ],
    infrastructure: [
      ["Mwangaza Primary", "18", "14", "3", "Yes"],
      ["Bahari Academy", "15", "11", "2", "No"],
      ["Kijani Secondary", "24", "20", "2", "Yes"],
    ],
    "ward-summary": [
      ["Mvita", "18", "8,420", "284", "68"],
      ["Kisauni", "22", "10,315", "342", "91"],
      ["Nyali", "15", "7,108", "219", "52"],
    ],
    "school-type": [
      ["Public", "98", "76%"],
      ["Private", "22", "17%"],
      ["Faith-Based", "6", "5%"],
      ["Community", "2", "2%"],
    ],
    "data-quality": [
      ["Has school code", "128", "128", "100%"],
      ["Has phone number", "119", "128", "93%"],
      ["Has email address", "111", "128", "87%"],
    ],
  };

  return rows[reportKey as keyof typeof rows] ?? rows["school-register"];
}

function ReportPreviewBody({
  report,
}: {
  report: ReturnType<typeof getReportDetail>;
}) {
  const rows = getReportPreviewRows(report.key);
  const [page, setPage] = useState(1);
  const pageSize = 2;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = rows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="report-preview-body">
      <div className="report-stat-grid">
        {report.metrics.slice(0, 4).map((metric, index) => (
          <div className="report-stat-card" key={metric}>
            <span>{metric}</span>
            <strong>
              {["128", "98", "28", "24,816"][index] ?? String(100 - index * 7)}
            </strong>
          </div>
        ))}
      </div>
      <div className="report-preview-content">
        <div className="report-preview-table-wrap">
          <table className="report-preview-table">
            <thead>
              <tr>
                {report.previewColumns.slice(0, 5).map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.join("-")}>
                  {row.slice(0, 5).map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination report-table-pagination">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, rows.length)} of {rows.length}{" "}
              rows
            </span>
            <div className="page-buttons">
              <button
                aria-label="Previous report rows"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <ChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    className={currentPage === pageNumber ? "current" : ""}
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ),
              )}
              <button
                aria-label="Next report rows"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setPage((value) => Math.min(totalPages, value + 1))
                }
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div className="report-visual-card">
          <h3>{report.visualizations[0]}</h3>
          {report.key === "data-quality" ? (
            <div className="report-progress-ring">
              <strong>92%</strong>
              <span>Overall Quality</span>
            </div>
          ) : report.visualizations[0]?.toLowerCase().includes("bar") ? (
            <div className="report-bar-preview">
              {[82, 64, 74, 58, 91].map((value, index) => (
                <span key={value} style={{ height: `${value}%` }}>
                  <i>{index + 1}</i>
                </span>
              ))}
            </div>
          ) : (
            <div className="report-donut-preview">
              <strong>{report.key === "school-type" ? "76%" : "68%"}</strong>
              <span>{report.visualizations[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportInformationTab({ report }: { report: string }) {
  const detail = getReportDetail(report);
  const SelectedIcon = getReportIcon(detail.key);

  return (
    <section className="report-workspace single-report-workspace">
      <div className="report-workspace-main">
        <div className="report-toolbar-card">
          <div className="report-toolbar-title">
            <span className="report-toolbar-icon">
              <SelectedIcon />
            </span>
            <div>
              <h2>{detail.title}</h2>
              <p>{detail.description}</p>
            </div>
          </div>
          <div className="report-toolbar-actions">
            {(detail.key === "enrollment" || detail.key === "ward-summary") && (
              <select aria-label="Academic year">
                <option>2025</option>
                <option>2024</option>
              </select>
            )}
            {detail.filters.includes("Ward") && (
              <select aria-label="Ward filter">
                <option>All Wards</option>
                <option>Mvita</option>
                <option>Kisauni</option>
                <option>Nyali</option>
              </select>
            )}
            <button>
              <RefreshCw /> Refresh
            </button>
            <button>
              <Download /> Export
            </button>
            <button>
              <Printer /> Print
            </button>
          </div>
        </div>
        <div className="report-definition-strip">
          <div>
            <ClipboardCheck />
            <span>Filters</span>
            <strong>{detail.filters.join(", ")}</strong>
          </div>
          <div>
            <Database />
            <span>Sources</span>
            <strong>{detail.dataSources.join(", ")}</strong>
          </div>
          <div>
            <ShieldCheck />
            <span>Output</span>
            <strong>{detail.format}</strong>
          </div>
        </div>
        <div className="report-preview-card">
          <ReportPreviewBody report={detail} />
        </div>
      </div>
    </section>
  );
}

export function DetailTabs({
  active,
  item,
  onTabChange,
}: {
  active: string;
  item: string;
  onTabChange?: (tab: string) => void;
}) {
  const [tab, setTab] = useState("Overview");
  const [term, setTerm] = useState("Term 1");
  const assessmentTab = getSchoolAssessment(item);
  useEffect(() => {
    if (active === "School Performance" && !["Overview", assessmentTab, "Trends"].includes(tab)) {
      setTab("Overview");
    }
  }, [active, assessmentTab, tab]);
  const tabs =
    active === "Enrollment"
      ? ["Overview", "Enrollment"]
      : active === "Schools"
        ? ["Overview", "Staff"]
        : active === "Infrastructure"
          ? ["Overview", "Infrastructure"]
          : active === "School Contacts"
            ? ["Overview", "Contacts"]
            : active === "Ward"
              ? ["Overview", "Schools"]
              : active === "Reports"
                ? ["Overview", "Report information"]
                : active === "School Performance"
                  ? ["Overview", assessmentTab, "Trends"]
                  : ["Overview"];

  const selectTab = (nextTab: string) => {
    setTab(nextTab);
    onTabChange?.(nextTab);
  };

  return (
    <>
      <div className="profile-tabs">
        {tabs.map((tabName) => (
          <button
            key={tabName}
            className={tab === tabName ? "active" : ""}
            onClick={() => selectTab(tabName)}
          >
            {tabName}
          </button>
        ))}
      </div>
      {active === "School Performance" &&
        (tab === "Overview" || tab === assessmentTab || tab === "Trends") && (
          <PerformanceContent detail school={item} overview={tab === "Overview"} />
        )}

      {tab === "Schools" && active === "Ward" && <WardSchoolsTab ward={item} />}
      {tab === "Report information" && active === "Reports" && (
        <ReportInformationTab report={item} />
      )}
      {tab === "Infrastructure" && (
        <InfrastructureContent detail school={item} />
      )}
      {tab === "Contacts" && <SchoolContactsContent school={item} />}
      {tab === "Enrollment" && active === "Schools" && (
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
                  <small>Academic Year 2026</small>
                </span>
                <b>{term === termName ? "Current" : "Select"}</b>
              </button>
            ))}
          </div>
          <EnrollmentGradeTable school={item} term={term} />
        </div>
      )}
      {tab === "Enrollment" && active !== "Schools" && (
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
                  <small>Academic Year 2026</small>
                </span>
                <b>{term === termName ? "Current" : "Select"}</b>
              </button>
            ))}
          </div>
          <EnrollmentGradeTable school={item} term={term} />
        </div>
      )}
    </>
  );
}
