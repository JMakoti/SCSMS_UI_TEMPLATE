"use client";

import { useRouter } from "next/navigation";
import { GenericPage } from "@/features/pages/generic-page";
import { routeForModule } from "@/features/navigation/route-for-module";

export function ModuleRoutePage({ active }: { active: string }) {
  const router = useRouter();

  return (
    <GenericPage
      active={active}
      setActive={() => undefined}
      onDetail={(item) =>
        router.push(`${routeForModule(active)}/${encodeURIComponent(item)}`)
      }
    />
  );
}

export default ModuleRoutePage;
