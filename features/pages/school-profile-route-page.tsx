"use client";

import { useRouter } from "next/navigation";
import { SchoolProfile } from "@/features/pages/school-profile-page";

export function SchoolProfileRoutePage({ schoolId }: { schoolId: string }) {
  const router = useRouter();

  return (
    <SchoolProfile schoolId={schoolId} onBack={() => router.push("/schools")} />
  );
}

export default SchoolProfileRoutePage;
