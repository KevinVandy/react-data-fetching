# Next.js RSC + React Query

This example demonstrates combining React Server Components with React Query, showing how to prefetch data on the server and seamlessly hydrate client components with enhanced caching and refetching capabilities.

## Key Learning Points

- **RSC + React Query Hybrid**: Server prefetching with client-side caching
- **HydrationBoundary**: Transferring server-fetched data to client
- **useSuspenseQuery**: Using prefetched data in client components
- **Server Prefetching**: Eliminate loading states with server data
- **Client Enhancement**: Add refetching and optimistic updates
- **Best of Both Worlds**: Server performance + client interactivity

## Code Examples

### Server Component with Query Prefetching

```tsx
// src/app/page.tsx:19-37
export default async function HomePage() {
  const queryClient = new QueryClient();

  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack>
        <Title order={2}>Your Home Feed</Title>
        <Suspense fallback={<Loader />}>
          <PostsFeed />
        </Suspense>
      </Stack>
    </HydrationBoundary>
  );
}
```

### Client Component Using Prefetched Data

```tsx
// src/app/PostsFeed.tsx:9-17
"use client";

export function PostsFeed() {
  const { data: posts, refetch: refetchPosts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts, // Same function used on server
  });

  return (
    <Stack>
      <ActionIcon onClick={() => refetchPosts()}>
        <IconRefresh />
      </ActionIcon>
      {/* Render posts */}
    </Stack>
  );
}
```

### Mixed Architecture Pattern

```tsx
// Server component handles initial data
export default async function PostPage({ params }: PostPageProps) {
  const { post, user, comments } = await fetchPostAndComments(+params.id);

  return (
    <Stack>
      {/* Server-rendered content */}
      <Title>Post: {post?.id}</Title>
      <Title>{post?.title}</Title>

      {/* Client component with server data */}
      <CommentSection comments={comments} postId={post.id} />
    </Stack>
  );
}
```

### Query Client Setup

```tsx
// Server-side query client creation
const queryClient = new QueryClient();

await queryClient.prefetchQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
});

// Transfer state to client
<HydrationBoundary state={dehydrate(queryClient)}>
  <PostsFeed />
</HydrationBoundary>;
```

## RSC + React Query Benefits

**1. Performance Optimization**

- Eliminate loading states with server prefetching
- Instant data availability on client
- Reduced time to interactive
- Streaming server responses

**2. Enhanced User Experience**

- Server-rendered initial content
- Client-side refetching and caching
- Optimistic updates for mutations
- Background data refreshing

**3. Development Experience**

- Same query functions work on server and client
- Type-safe data flow
- Familiar React Query patterns
- Server/client code sharing

**4. Flexible Architecture**

- Choose per-component whether to use server or client rendering
- Progressive enhancement approach
- Granular control over data fetching strategy

## Patterns Demonstrated

**Server Prefetching**: Use `prefetchQuery` in server components to populate cache
**Hydration Boundary**: Transfer server query state to client components
**Suspense Integration**: No loading states needed for prefetched data
**Client Enhancement**: Add refetching, mutations, and real-time updates

## vs Pure RSC (4-1)

**Added Benefits:**

- Client-side caching and refetching
- Background updates and revalidation
- Optimistic updates for better UX
- Query invalidation and synchronization

**Trade-offs:**

- Larger client bundle (React Query)
- More complex hydration setup
- Additional abstraction layer

## When to Use RSC + React Query

**Perfect For:**

- Apps needing both server performance and rich client interactivity
- Complex data synchronization requirements
- Applications with frequent data updates
- Teams familiar with React Query patterns

This hybrid approach provides server-side performance benefits while maintaining the powerful client-side data management capabilities of React Query.
