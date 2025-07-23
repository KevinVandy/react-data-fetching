# TanStack Router with Route Loaders

This example demonstrates TanStack Router's built-in data loading capabilities using route loaders, which pre-fetch data before components render, eliminating loading states and creating a smoother user experience.

## Key Learning Points

- **Route Loaders**: Pre-fetch data at the route level before components render
- **ensureQueryData**: TanStack Query integration that ensures data is loaded and cached
- **Parallel Data Loading**: Loading multiple related queries simultaneously
- **No Loading States**: Components receive data immediately since loaders pre-fetch everything
- **Route-Level Data Dependencies**: Coordinated data loading based on route parameters
- **Stale Time Configuration**: Controlling when route loaders should re-run

## Code Examples

### Basic Route Loader
```tsx
// AppRoutes.tsx:34-40
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(postsQueryOptions),
  component: HomePage,
});
```

### Route Loader with Parameters
```tsx
// AppRoutes.tsx:50-63
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
```

### Dependent Route Loading
```tsx
// AppRoutes.tsx:65-79
const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$id",
  loader: async ({ context: { queryClient }, params: { id } }) => {
    // First load the post
    const post = await queryClient.ensureQueryData(postQueryOptions(id));
    
    // Then load user and comments in parallel using the post data
    await Promise.all([
      queryClient.ensureQueryData(userQueryOptions(post.userId)),
      queryClient.ensureQueryData(postCommentsQueryOptions(id)),
    ]);
  },
  component: PostPage,
});
```

### Simplified Component Code
```tsx
// pages/PostPage.tsx:32-39
// All data is already loaded by the route loader, so these will resolve immediately
const { data: post } = useSuspenseQuery(postQueryOptions(postId));
const { data: user } = useSuspenseQuery(userQueryOptions(post.userId));
const {
  data: comments,
  isFetching: isFetchingComments,
  refetch: refetchComments,
} = useSuspenseQuery(postCommentsQueryOptions(postId));
```

### Route Context Configuration
```tsx
// AppRoutes.tsx:23-32
const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
  context: () => ({
    queryClient, // Make queryClient available to all route loaders
  }),
});
```

### Loader Configuration for React Query Integration
```tsx
// AppRoutes.tsx:90-104
export const createAppRouter = (queryClient: QueryClient) => {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent", // Preload on hover/focus
    // Since we're using React Query, we don't want loader calls to ever be stale
    defaultPreloadStaleTime: 0, // Always re-run loaders
    scrollRestoration: true,
    context: {
      queryClient,
    },
  });
  
  return router;
};
```

## Benefits of Route Loaders

**1. Eliminated Loading States**
- Components receive data immediately
- No more spinner components or skeleton screens
- Smoother user experience

**2. Coordinated Data Loading**
- Load related data together in parallel
- Handle data dependencies at the route level
- Better performance with reduced waterfalls

**3. Preloading Support**
- Data loads on hover/focus with `defaultPreload: "intent"`
- Instant navigation when user clicks
- Better perceived performance

**4. Error Boundaries**
- Route-level error handling
- Failed data loads are caught before components render
- More consistent error states

## Comparison with Previous Examples

**1-6 (Component-level loading):**
```tsx
const { data: post, isLoading } = useQuery(postQueryOptions(postId!));
if (isLoading) return <Spinner />;
```

**1-7 (Route-level loading):**
```tsx
// Route loader pre-fetches data
const { data: post } = useSuspenseQuery(postQueryOptions(postId)); // Resolves immediately
```

Route loaders represent a significant architectural improvement, moving data fetching concerns from components to routes, resulting in better user experience and cleaner component code.