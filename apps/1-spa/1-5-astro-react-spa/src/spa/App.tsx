import { AppRoutes } from "./AppRoutes";
import { AppProviders } from "./AppProviders";
import "@mantine/core/styles.css";
import "mantine-react-table/styles.css";

export const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};
