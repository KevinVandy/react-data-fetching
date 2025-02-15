import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import { ColorSchemeScript } from "@mantine/core";

export default function ReactProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider theme={theme}>
      <ColorSchemeScript />
      {children}
    </MantineProvider>
  );
}
