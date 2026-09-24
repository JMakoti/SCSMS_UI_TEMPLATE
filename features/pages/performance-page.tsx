import { rabaiSchools } from "@/seeders/rabai-schools";
import type { AssessmentKey } from "@/features/pages/performamce-trend";

export function getSchoolAssessment(school: string): AssessmentKey {
  const normalized = school.toLowerCase();
  if (normalized.includes("junior") || normalized.includes("jss")) return "KJSEA";
  if (normalized.includes("secondary") || normalized.includes("senior")) return "KCSE";
  return "KPSEA";
}

const defaultPerformanceSchool = [...rabaiSchools].sort((a, b) => a.displayName.localeCompare(b.displayName))[0]?.displayName ?? "Not provided";

const assessments = {
  KPSEA: { title: "KPSEA", subtitle: "Kenya Primary School Education Assessment — Grade 6", candidates: "86", mean: "73%", best: "78%", bestSubject: "Creative Arts", below: "12%", belowLearners: "60 learners", areas: ["Mathematics", "English", "Kiswahili", "Science & Technology", "Social Studies", "Creative Arts"], scores: ["74%", "70%", "73%", "68%", "76%", "78%"], years: ["60%", "64%", "68%", "72%"] },
  KJSEA: { title: "KJSEA", subtitle: "Kenya Junior School Education Assessment — Grade 9", candidates: "72", mean: "69%", best: "75%", bestSubject: "English", below: "15%", belowLearners: "54 learners", areas: ["Mathematics", "English", "Kiswahili", "Integrated Science", "Social Studies", "Creative Arts"], scores: ["70%", "75%", "68%", "66%", "71%", "73%"], years: ["57%", "61%", "65%", "69%"] },
  KCSE: { title: "KCSE", subtitle: "Kenya Certificate of Secondary Education", candidates: "64", mean: "7.3", best: "8.1", bestSubject: "English", below: "18%", belowLearners: "42 learners", areas: ["English", "Kiswahili", "Mathematics", "Biology", "Chemistry", "History & Government"], scores: ["8.1", "7.5", "7.2", "6.8", "7.4", "7.6"], years: ["6.4", "6.7", "7.0", "7.3"] },
} as const;

export default function PerformanceContent({ school = defaultPerformanceSchool }: { detail?: boolean; school?: string }) {
  const assessmentKey = getSchoolAssessment(school);
  const data = assessments[assessmentKey];
  return <section className="panel detail-panel performance-overview">
    <header className="performance-overview-heading"><h2>{data.title}</h2><p>{data.subtitle}</p></header>
    <div className="performance-metric-grid">{[["Candidates", data.candidates, "01", "Grade 6 · 2026"], ["Overall mean", data.mean, "M", "+4.2% vs previous year"], ["Best subject", data.best, "★", data.bestSubject], ["Below expectation", data.below, "↓", data.belowLearners]].map(([label, value, icon, note]) => <article className="performance-metric-card" key={label}><span>{label}</span><b>{icon}</b><strong>{value}</strong><small>{note}</small></article>)}</div>
    <section className="performance-subject-panel"><div className="performance-section-title"><div><h3>Subject Performance</h3><p>Candidates who sat each subject and their mean score — 2026</p></div></div><div className="performance-table-scroll"><table className="performance-table"><thead><tr><th>Subject</th><th>Candidates</th><th>Mean</th><th>Exceeding</th><th>Meeting</th><th>Below</th><th>Status</th></tr></thead><tbody>{data.areas.map((area, index) => <tr key={area}><th>{area}</th><td>{index === 5 ? "84" : data.candidates}</td><td className="score-good">{data.scores[index]}</td><td>{["32%", "26%", "30%", "22%", "34%", "38%"][index]}</td><td>{["44%", "48%", "46%", "48%", "44%", "42%"][index]}</td><td>{["10%", "12%", "10%", "16%", "8%", "4%"][index]}</td><td><span className="performance-status">● {index > 3 ? "Strong" : "Steady"}</span></td></tr>)}</tbody></table></div></section>
    <section className="performance-trend-panel"><div className="performance-section-title"><div><h3>{data.title} Trend</h3><p>Mean score by year</p></div><button type="button">All assessments⌄</button></div><div className="performance-bars">{data.years.map((score, index) => <div className="performance-bar-column" key={score}><div className="performance-bar" style={{ height: `${42 + index * 12}px` }} /><strong>{score}</strong><small>{2023 + index}</small></div>)}</div></section>
  </section>;
}

