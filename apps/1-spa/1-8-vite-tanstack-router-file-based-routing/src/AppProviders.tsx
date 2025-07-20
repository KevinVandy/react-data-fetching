import { lazy, Suspense } from "react";
import { Loader, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { theme } from "./theme";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

const TanStackRouterDevtools = lazy(() =>
  // Lazy load in development
  import("@tanstack/router-devtools").then((res) => ({
    default: res.TanStackRouterDevtools,
  })),
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // 10 seconds
    },
  },
});

// Create the router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  context: {
    queryClient,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

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
