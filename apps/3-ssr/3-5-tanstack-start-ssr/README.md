# TanStack Start Server-Side Rendering (SSR)

This example demonstrates TanStack Start's SSR capabilities, showing how it combines TanStack Router with React Query for type-safe, full-stack React applications with efficient data preloading and seamless server/client hydration.

## Key Learning Points

- **TanStack Start Framework**: Full-stack React with TanStack Router + Vite
- **Route Loaders**: Server-side data preloading with `ensureQueryData`
- **Query Options Pattern**: Centralized, reusable query definitions
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

### Dynamic Route with Parallel Loading
```tsx
// src/routes/posts.$id.tsx:28-40
export const Route = createFileRoute("/posts/$id")({
  loader: async ({ context: { queryClient }, params: { id } }) => {
    // First load the post
    const post = await queryClient.ensureQueryData(postQueryOptions(id));

    // Then load user and comments in parallel
    await Promise.all([
      queryClient.ensureQueryData(userQueryOptions(post.userId)),
      queryClient.ensureQueryData(postCommentsQueryOptions(id)),
    ]);
  },
  component: PostPage,
});
```

### Suspense Query Usage
```tsx
// src/routes/posts.$id.tsx:42-53
function PostPage() {
  const { id: postId } = useParams({ from: "/posts/$id" });

  // All data is already loaded by the route loader, so these resolve immediately
  const { data: post } = useSuspenseQuery(postQueryOptions(postId));
  const { data: user } = useSuspenseQuery(userQueryOptions(post.userId));
  const { data: comments, refetch: refetchComments } = useSuspenseQuery(
    postCommentsQueryOptions(postId)
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
- Server-side data preloading eliminates loading states
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
**Suspense Integration**: No loading states needed for preloaded data
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