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
import {
  postsQueryOptions,
  postQueryOptions,
  userPostsQueryOptions,
} from "./queries/posts";
import { usersQueryOptions, userQueryOptions } from "./queries/users";
import { postCommentsQueryOptions } from "./queries/comments";
import { queryClient } from "./AppProviders";
import { QueryClient } from "@tanstack/react-query";

// Create routes
const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
  context: () => ({
    queryClient,
  }),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(postsQueryOptions),
  component: HomePage,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(usersQueryOptions),
  component: UsersPage,
});

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users/$id",
  loader: async ({ context: { queryClient }, params: { id } }) => {
    const userId = parseInt(id);

    // Load both user and their posts in parallel
    await Promise.all([
      queryClient.ensureQueryData(userQueryOptions(userId)),
      queryClient.ensureQueryData(userPostsQueryOptions(userId)),
    ]);
  },
  component: UserPage,
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$id",
  loader: async ({ context: { queryClient }, params: { id } }) => {
    // First load the post
    const post = await queryClient.ensureQueryData(postQueryOptions(id));

    // Load user immediately
    await queryClient.ensureQueryData(userQueryOptions(post.userId));

    // Defer comments loading - return the promise without awaiting
    const deferredComments = queryClient.ensureQueryData(
      postCommentsQueryOptions(id),
    );

    return {
      deferredComments,
    };
  },
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
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
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
