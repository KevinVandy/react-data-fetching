import { lazy, Suspense } from "react";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { 
  createRouter, 
  RouterProvider,
  createRootRoute,
  createRoute,
  Outlet
} from "@tanstack/react-router";
import { theme } from "./theme";
import { AppLayout } from "./AppLayout";
import { HomePage } from "./pages/HomePage";
import { UsersPage } from "./pages/UsersPage";
import { UserPage } from "./pages/UserPage";
import { PostPage } from "./pages/PostPage";

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

const TanStackRouterDevtools =
  typeof window !== "undefined" 
    ? lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )
    : () => null; // Render nothing on server side

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // 10 seconds
    },
  },
});

// Create routes
const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: UsersPage,
});

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users/$id',
  component: UserPage,
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts/$id',
  component: PostPage,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  usersRoute,
  userRoute,
  postRoute,
]);

// Create a new router instance
const router = createRouter({ routeTree });

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
        <RouterProvider router={router} />
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
        <Suspense fallback={null}>
          <TanStackRouterDevtools />
        </Suspense>
      </MantineProvider>
    </QueryClientProvider>
  );
};
