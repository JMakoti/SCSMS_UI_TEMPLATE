import { ArrowUpRight, CalendarDays, ChartNoAxesCombined, GraduationCap, School, Target } from "lucide-react";
import { rabaiSchools } from "@/seeders/rabai-schools";
import PerformanceTrends, { type AssessmentKey } from "@/features/pages/performamce-trend";

export function getSchoolAssessment(school: string): AssessmentKey {
  const normalized = school.toLowerCase();
  if (normalized.includes("junior") || normalized.includes("jss")) return "KJSEA";
  if (normalized.includes("secondary") || normalized.includes("senior")) return "KCSE";
  return "KPSEA";
}

const defaultPerformanceSchool = [...rabaiSchools].sort((a, b) => a.displayName.localeCompare(b.displayName))[0]?.displayName ?? "Not provided";

const assessmentDetails = {
  KPSEA: { level: "Primary school", name: "Kenya Primary School Education Assessment", score: "72.4%", candidates: "48", change: "+4.8%", descriptor: "Learner proficiency across the six primary learning areas", subjects: ["Mathematics", "English", "Kiswahili", "Science & Technology", "Agriculture", "Creative Arts"] },
  KJSEA: { level: "Junior school", name: "Kenya Junior School Education Assessment", score: "68.5%", candidates: "41", change: "+3.2%", descriptor: "Junior school learning area outcomes for the latest cohort", subjects: ["Mathematics", "English", "Kiswahili", "Integrated Science", "Social Studies", "Creative Arts"] },
  KCSE: { level: "Secondary school", name: "Kenya Certificate of Secondary Education", score: "7.31", candidates: "36", change: "+0.42", descriptor: "Mean grade performance across the school&apos;s secondary cohort", subjects: ["English", "Kiswahili", "Mathematics", "Biology", "Chemistry", "History & Government"] },
} as const;

export default function PerformanceContent({ detail = false, school = defaultPerformanceSchool }: { detail?: boolean; school?: string }) {
  const assessmentKey = getSchoolAssessment(school);
  if (!detail) return <PerformanceTrends assessmentKey={assessmentKey} />;

  const details = assessmentDetails[assessmentKey];
  return (
    <section className="panel detail-panel school-performance-panel">
      <header className="school-performance-hero">
        <div className="school-performance-identity">
          <div className="school-performance-icon"><School /></div>
          <div>
            <p className="school-performance-kicker">School performance</p>
            <h2>{school}</h2>
            <p>{assessmentKey} · {details.level}</p>
          </div>
        </div>
        <div className="school-performance-period"><CalendarDays /><span>2023 – 2026 reporting period</span></div>
      </header>

      <div className="school-performance-summary">
        <div className="school-performance-score"><span>Latest mean score</span><strong>{details.score}</strong><small>2026 assessment</small></div>
        <div className="school-performance-summary-copy"><span className="school-performance-eyebrow">{assessmentKey} assessment</span><h3>{details.name}</h3><p>{details.descriptor}</p></div>
        <div className="school-performance-change"><ArrowUpRight /><strong>{details.change}</strong><span>vs previous assessment</span></div>
      </div>

      <div className="school-performance-content-grid">
        <div className="school-performance-trend-block">
          <div className="school-performance-section-heading"><div><span className="school-performance-section-icon"><ChartNoAxesCombined /></span><div><h3>Performance movement</h3><p>Track the school&apos;s mean score across reporting years.</p></div></div><span className="school-performance-level"><GraduationCap /> {details.level}</span></div>
          <PerformanceTrends assessmentKey={assessmentKey} />
        </div>
        <aside className="school-performance-subjects" aria-label={`${assessmentKey} assessment summary`}>
          <div className="school-performance-section-heading"><div><span className="school-performance-section-icon"><Target /></span><div><h3>Assessment snapshot</h3><p>Coverage for the latest cohort.</p></div></div></div>
          <div className="school-performance-snapshot"><div><strong>{details.candidates}</strong><span>candidates</span></div><div><strong>{details.subjects.length}</strong><span>learning areas</span></div></div>
          <div className="school-performance-subject-list">{details.subjects.map((subject, index) => <div key={subject}><span>{String(index + 1).padStart(2, "0")}</span><strong>{subject}</strong><span className="school-performance-subject-status">Included</span></div>)}</div>
        </aside>
      </div>
    </section>
  );
}

