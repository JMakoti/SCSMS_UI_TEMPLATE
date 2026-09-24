import { rabaiSchools } from "@/seeders/rabai-schools";
import PerformanceTrends, { type AssessmentKey } from "@/features/pages/performamce-trend";

export function getSchoolAssessment(school: string): AssessmentKey {
  const normalized = school.toLowerCase();
  if (normalized.includes("junior") || normalized.includes("jss")) return "KJSEA";
  if (normalized.includes("secondary") || normalized.includes("senior")) return "KCSE";
  return "KPSEA";
}

const registrySchools = [...rabaiSchools].sort((a, b) =>
  a.displayName.localeCompare(b.displayName),
);
const defaultPerformanceSchool =
  registrySchools[0]?.displayName ?? "Not provided";

export default function PerformanceContent({
  detail = false,
  school = defaultPerformanceSchool,
}: {
  detail?: boolean;
  school?: string;
}) {
  const assessmentKey = getSchoolAssessment(school);

  if (!detail) return <PerformanceTrends assessmentKey={assessmentKey} />;

  return (
    <section className="panel detail-panel report-overview-panel">
      <div className="panel-header">
        <div>
          <h2>{school} performance details</h2>
          <p>Assessment results and multi-year trend analysis</p>
        </div>
      </div>
      <dl className="detail-list report-detail-list">
        <div><dt>School</dt><dd>{school}</dd></div>
        <div><dt>Assessment coverage</dt><dd>KCSE, KJSEA and KPSEA</dd></div>
        <div><dt>Reporting period</dt><dd>2023 – 2026</dd></div>
        <div><dt>Latest mean score</dt><dd>9.30</dd></div>
        <div><dt>Subjects assessed</dt><dd>12</dd></div>
      </dl>
      <PerformanceTrends assessmentKey={assessmentKey} />
    </section>
  );
}


