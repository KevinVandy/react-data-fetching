import { type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./theme";

interface Props {
  children: ReactNode;
}

export const AppProviders = ({ children }: Props) => {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme}>{children}</MantineProvider>
    </BrowserRouter>
  );
};
