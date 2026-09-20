"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { academicYears, activeAcademicYear } from "@/seeders/academic-years";

type AcademicYearContextValue = {
  academicYears: typeof academicYears;
  currentAcademicYear: (typeof academicYears)[number];
  setCurrentAcademicYearId: (id: string) => void;
};

const AcademicYearContext = createContext<AcademicYearContextValue | null>(
  null,
);

export function AcademicYearProvider({ children }: { children: ReactNode }) {
  const [currentAcademicYearId, setCurrentAcademicYearId] = useState(
    activeAcademicYear.id,
  );
  const currentAcademicYear =
    academicYears.find((year) => year.id === currentAcademicYearId) ??
    activeAcademicYear;

  const value = useMemo(
    () => ({
      academicYears,
      currentAcademicYear,
      setCurrentAcademicYearId,
    }),
    [currentAcademicYear],
  );

  return (
    <AcademicYearContext.Provider value={value}>
      {children}
    </AcademicYearContext.Provider>
  );
}

export function useAcademicYear() {
  const value = useContext(AcademicYearContext);
  if (!value) {
    throw new Error("useAcademicYear must be used inside AcademicYearProvider");
  }
  return value;
}
