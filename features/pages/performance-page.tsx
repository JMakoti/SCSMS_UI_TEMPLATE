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
  const assessmentDetails = {
    KPSEA: {
      latestScore: "72.4%",
      candidates: "48",
      subjects: ["Mathematics", "English", "Kiswahili", "Science & Technology", "Agriculture", "Creative Arts"],
      descriptor: "Learner proficiency across the six primary learning areas",
    },
    KJSEA: {
      latestScore: "68.5%",
      candidates: "41",
      subjects: ["Mathematics", "English", "Kiswahili", "Integrated Science", "Social Studies", "Creative Arts"],
      descriptor: "Junior school learning area outcomes for the latest cohort",
    },
    KCSE: {
      latestScore: "7.31",
      candidates: "36",
      subjects: ["English", "Kiswahili", "Mathematics", "Biology", "Chemistry", "History & Government"],
      descriptor: "Mean grade performance across the school's secondary cohort",
    },
  }[assessmentKey];

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
        <div className="school-performance-metric"><span>Latest mean score</span><strong>{assessmentDetails.latestScore}</strong><small>2026 assessment</small></div>
        <div className="school-performance-metric"><span>Assessment</span><strong>{assessmentKey}</strong><small>School-level measure</small></div>
        <div className="school-performance-metric"><span>Candidates</span><strong>{assessmentDetails.candidates}</strong><small>Learners assessed</small></div>
        <div className="school-performance-metric"><span>Trend status</span><strong className="positive">Improving</strong><small>Year-on-year movement</small></div>
      </div>
      <div className="school-performance-content-grid">
        <div className="school-performance-trend-block">
          <div className="school-performance-section-heading">
            <div><span className="school-performance-section-icon"><ChartNoAxesCombined /></span><div><h3>{assessmentKey} performance trend</h3><p>Track this school&apos;s results across the reporting years.</p></div></div>
            <span className="school-performance-level"><GraduationCap /> {schoolLevel}</span>
          </div>
          <PerformanceTrends assessmentKey={assessmentKey} />
        </div>
        <aside className="school-performance-subjects" aria-label={`${assessmentKey} subjects and candidates`}>
          <div className="school-performance-subjects-heading"><div><span className="school-performance-section-icon"><GraduationCap /></span><div><h3>Assessment coverage</h3><p>{assessmentDetails.descriptor}</p></div></div></div>
          <div className="school-performance-candidate-count"><strong>{assessmentDetails.candidates}</strong><span>candidates took {assessmentKey}</span></div>
          <div className="school-performance-subject-list">
            {assessmentDetails.subjects.map((subject, index) => <div key={subject}><span>{String(index + 1).padStart(2, "0")}</span><strong>{subject}</strong></div>)}
          </div>
        </aside>
      </div>
    </section>
  );
}


