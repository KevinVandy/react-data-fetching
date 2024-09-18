import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "../theme";
import { AppLayout } from "@/components/AppLayout";
import { ReactQueryProvider } from "./ReactQueryProvider";

export const metadata = {
  title: "Next JS RSC",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ReactQueryProvider>
            <AppLayout>{children}</AppLayout>
          </ReactQueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
