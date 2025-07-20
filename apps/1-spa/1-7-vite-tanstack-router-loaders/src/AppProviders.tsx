import { lazy, Suspense } from "react";
import { Loader, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { theme } from "./theme";
import { createAppRouter } from "./AppRoutes";

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

const TanStackRouterDevtools = lazy(() =>
  // Lazy load in development
  import("@tanstack/router-devtools").then((res) => ({
    default: res.TanStackRouterDevtools,
  }))
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // 10 seconds
    },
  },
});

const router = createAppRouter(queryClient);

interface Props {
  // children prop is not needed since router handles all rendering
}

export const AppProviders = ({}: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Suspense fallback={<Loader size="xl" />}>
          <RouterProvider router={router} />
        </Suspense>
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
          <TanStackRouterDevtools router={router} />
        </Suspense>
      </MantineProvider>
    </QueryClientProvider>
  );
};
