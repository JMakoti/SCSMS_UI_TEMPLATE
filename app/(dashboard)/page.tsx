"use client";

import { useRouter } from "next/navigation";
import Dashboard from "@/features/pages/dashboard-page";
import { routeForModule } from "@/features/navigation/route-for-module";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <Dashboard
      setActive={(moduleName) => router.push(routeForModule(moduleName))}
    />
  );
}
