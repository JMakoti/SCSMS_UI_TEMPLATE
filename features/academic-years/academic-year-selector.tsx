"use client";

import { ChevronDown } from "lucide-react";
import { useAcademicYear } from "@/features/academic-years/academic-year-context";

export function AcademicYearSelector() {
  const { academicYears, currentAcademicYear, setCurrentAcademicYearId } =
    useAcademicYear();

  return (
    <label className="academic-year-selector">
      <span>Academic Year</span>
      <select
        value={currentAcademicYear.id}
        onChange={(event) => setCurrentAcademicYearId(event.target.value)}
      >
        {academicYears.map((year) => (
          <option key={year.id} value={year.id}>
            {year.name}
            {year.isClosed ? " - Closed" : " - Active"}
          </option>
        ))}
      </select>
      <ChevronDown />
    </label>
  );
}

export default AcademicYearSelector;
