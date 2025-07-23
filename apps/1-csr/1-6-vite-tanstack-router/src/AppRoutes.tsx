import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { AppLayout } from "./AppLayout";
import { HomePage } from "./pages/HomePage";
import { UsersPage } from "./pages/UsersPage";
import { UserPage } from "./pages/UserPage";
import { PostPage } from "./pages/PostPage";
import { QueryClient } from "@tanstack/react-query";

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
  path: "/",

  component: HomePage,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",

  component: UsersPage,
});

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users/$id",
  component: UserPage,
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$id",
  component: PostPage,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  usersRoute,
  userRoute,
  postRoute,
]);

// Create and export router factory function
export const createAppRouter = (queryClient: QueryClient) => {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    context: {
      queryClient,
    },
  });

  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
