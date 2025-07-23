# TanStack Start Server-Side Rendering (SSR)

This example demonstrates TanStack Start's SSR capabilities, showing how it combines TanStack Router with React Query for type-safe, full-stack React applications with efficient data preloading and seamless server/client hydration.

## Key Learning Points

- **TanStack Start Framework**: Full-stack React with TanStack Router + Vite
- **Route Loaders**: Server-side data preloading with `ensureQueryData`
- **Query Options Pattern**: Centralized, reusable query definitions
- **Deferred Data Loading**: Stream non-critical data with skeleton states
- **Suspense Integration**: `useSuspenseQuery` with preloaded data
- **Type-Safe Routing**: Fully typed routes and parameters
- **Server/Client Hydration**: Seamless data flow between server and client

## Code Examples

### Route with Data Preloading

```tsx
// src/routes/index.tsx:7-11
export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(postsQueryOptions),
  component: HomePage,
});
```

### Query Options Pattern

```typescript
// src/queries/posts.ts:6-13
export const postsQueryOptions = queryOptions({
  queryKey: ["/posts"],
  queryFn: async () => {
    const response = await fetch(`${API_URL}/posts`);
    return response.json() as Promise<IPost[]>;
  },
});
```

### Dynamic Route with Deferred Loading

```tsx
// src/routes/posts.$id.tsx:30-44
export const Route = createFileRoute("/posts/$id")({
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
```

### Deferred Data with Suspense and Skeletons

```tsx
// src/routes/posts.$id.tsx:247-288
function PostPage() {
  const queryClient = useQueryClient();
  const { id: postId } = useParams({ from: "/posts/$id" });
  const { deferredComments } = Route.useLoaderData();

  // Post and user data is already loaded by the route loader, so these will resolve immediately
  const { data: post } = useSuspenseQuery(postQueryOptions(postId));
  const { data: user } = useSuspenseQuery(userQueryOptions(post.userId));

  return (
    <Stack>
      {/* Post content renders immediately */}
      <Box>
        <Title order={1}>Post: {post.id}</Title>
        <Title order={2}>{post.title}</Title>
        <Text my="lg">{post.body}</Text>
      </Box>

      {/* Comments load asynchronously with skeleton loading state */}
      <Suspense fallback={<CommentsSkeleton />}>
        <Await promise={deferredComments}>
          {() => <CommentsSection postId={postId} queryClient={queryClient} />}
        </Await>
      </Suspense>
    </Stack>
  );
}
```

### Skeleton Loading Component

```tsx
// src/routes/posts.$id.tsx:48-62
function CommentsSkeleton() {
  return (
    <Stack gap="xl">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card withBorder key={index}>
          <Stack gap="xs">
            <Skeleton height={20} width="30%" />
            <Skeleton height={16} width="50%" />
            <Skeleton height={60} />
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
```

### Root Route with Context

```tsx
// src/routes/__root.tsx:22-24
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  // Route configuration...
});
```

## TanStack Start Benefits

**1. Type Safety**

- Fully typed routes, parameters, and loaders
- Type-safe navigation and link generation
- QueryOptions provide consistent typing

**2. Performance**

- Server-side data preloading eliminates loading states for critical data
- Deferred loading streams non-critical data with skeleton placeholders
- Efficient hydration with preloaded cache
- Automatic code splitting and lazy loading

**3. Developer Experience**

- File-based routing with automatic route generation
- Integrated devtools for routing and queries
- Seamless server/client development patterns

**4. React Query Integration**

- Server-side `ensureQueryData` for preloading
- Client-side `useSuspenseQuery` for immediate data access
- Shared query definitions between server and client

## TanStack Start Patterns

**Query Options**: Centralized query definitions that work on both server and client
**Route Loaders**: Preload critical data before component rendering
**Deferred Loading**: Stream non-critical data with TanStack Router's Await component
**Suspense Integration**: No loading states needed for preloaded data, skeleton states for deferred data
**Type-Safe Params**: Automatic parameter typing from route definitions

## When to Use TanStack Start

**Perfect For:**

- Type-safe full-stack React applications
- Apps requiring fast initial page loads
- Projects using TanStack ecosystem
- Teams prioritizing developer experience

**Requirements:**

- Comfort with TanStack Router patterns
- Need for type safety across the stack
- Modern React development (Suspense, etc.)

TanStack Start provides an excellent developer experience with strong typing and performance optimizations for modern React applications.
