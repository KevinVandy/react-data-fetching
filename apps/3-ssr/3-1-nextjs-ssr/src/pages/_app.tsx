import "@mantine/core/styles.css";
import { Suspense, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "@/theme";
import { AppLayout } from "@/components/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const ReactQueryDevtoolsProduction = dynamic(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 10, // 10 seconds
          },
        },
      }),
  );

  return (
    <>
      <Head>
        <title>Next JS SSR (and React Query)</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <AppLayout>
            <Component {...pageProps} />
            <Suspense fallback={null}>
              <ReactQueryDevtoolsProduction />
            </Suspense>
          </AppLayout>
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}
