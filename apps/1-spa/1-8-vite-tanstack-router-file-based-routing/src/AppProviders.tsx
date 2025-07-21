import { lazy, Suspense } from "react";
import { Loader, MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { theme } from "./theme";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient, router } from "./router";

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
