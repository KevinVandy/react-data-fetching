import { lazy, Suspense, type ReactNode } from "react";
import { LoadingOverlay, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./theme";

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // 10 seconds
    },
  },
});

interface Props {
  children: ReactNode;
}

export const AppProviders = ({ children }: Props) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <Suspense fallback={<LoadingOverlay visible />}>{children}</Suspense>
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
