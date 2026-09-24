import { CalendarDays, ChartNoAxesCombined, GraduationCap, School } from "lucide-react";
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

  const schoolLevel = assessmentKey === "KPSEA" ? "Primary school" : assessmentKey === "KJSEA" ? "Junior school" : "Secondary school";
  const assessmentName = assessmentKey === "KPSEA" ? "Kenya Primary School Education Assessment" : assessmentKey === "KJSEA" ? "Kenya Junior School Education Assessment" : "Kenya Certificate of Secondary Education";
  const latestScore = assessmentKey === "KPSEA" ? "72.4%" : assessmentKey === "KJSEA" ? "68.5%" : "7.31";
  const subjects = assessmentKey === "KPSEA" ? "6 learning areas" : assessmentKey === "KJSEA" ? "9 learning areas" : "12 subjects";

  return (
    <section className="panel detail-panel school-performance-panel">
      <div className="school-performance-hero">
        <div className="school-performance-identity">
          <div className="school-performance-icon"><School /></div>
          <div>
            <p className="school-performance-kicker">{schoolLevel} · performance overview</p>
            <h2>{school}</h2>
            <p>{assessmentKey} · {assessmentName}</p>
          </div>
        </div>
        <div className="school-performance-period"><CalendarDays /><span>2023 – 2026</span></div>
      </div>
      <div className="school-performance-metrics">
        <div className="school-performance-metric"><span>Latest mean score</span><strong>{latestScore}</strong><small>2026 assessment</small></div>
        <div className="school-performance-metric"><span>Assessment</span><strong>{assessmentKey}</strong><small>School-level measure</small></div>
        <div className="school-performance-metric"><span>Coverage</span><strong>{subjects}</strong><small>Latest reporting cycle</small></div>
        <div className="school-performance-metric"><span>Trend status</span><strong className="positive">Improving</strong><small>Year-on-year movement</small></div>
      </div>
      <div className="school-performance-section-heading">
        <div><span className="school-performance-section-icon"><ChartNoAxesCombined /></span><div><h3>{assessmentKey} performance trend</h3><p>Track this school&apos;s results across the reporting years.</p></div></div>
        <span className="school-performance-level"><GraduationCap /> {schoolLevel}</span>
      </div>
      <PerformanceTrends assessmentKey={assessmentKey} />
    </section>
  );
}


