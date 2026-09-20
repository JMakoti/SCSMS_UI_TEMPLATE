import { moduleRoutes } from "@/features/navigation/module-routes";

export function routeForModule(moduleName: string) {
  return moduleRoutes[moduleName] ?? "/";
}
