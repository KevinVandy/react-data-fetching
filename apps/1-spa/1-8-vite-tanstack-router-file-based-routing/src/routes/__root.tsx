import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { AppLayout } from "../AppLayout";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRoute({
  context: (): RouterContext => undefined!,
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
