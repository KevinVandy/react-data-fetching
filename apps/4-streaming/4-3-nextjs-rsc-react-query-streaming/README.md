# Next.js RSC + React Query Streaming

This example demonstrates the experimental React Query streaming integration with Next.js App Router, using `@tanstack/react-query-next-experimental` for seamless server-side streaming and client-side hydration with improved performance.

## Key Learning Points

- **Experimental Streaming**: `ReactQueryStreamedHydration` for progressive data loading
- **Edge Runtime**: Enhanced performance with edge computing
- **Automatic Hydration**: Seamless server-to-client state transfer
- **Client-Only Queries**: Pure client-side data fetching without server prefetching
- **Streaming Architecture**: Progressive page rendering with React Suspense
- **Future-Ready Patterns**: Experimental features for next-generation React apps

## Code Examples

### Experimental Provider Setup
```tsx
// src/app/ReactQueryProvider.tsx:46-61
export function ReactQueryProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
        <ReactQueryDevtoolsProduction />
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
```

### Query Client Factory Pattern
```tsx
// src/app/ReactQueryProvider.tsx:18-44
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, set staleTime to avoid immediate refetching
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: reuse client to avoid React suspense issues
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
```

### Client Component with Streaming
```tsx
// src/app/page.tsx:20-29
export default function HomePage() {
  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
      <Suspense fallback={<Loader />}>
        <Posts />
      </Suspense>
    </Stack>
  );
}
```

### Suspense Query Pattern
```tsx
// src/app/page.tsx:31-47
function Posts() {
  const { data: posts, refetch: refetchPosts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3300/posts", {
        cache: "no-store", // Disable Next.js caching
      });
      return response.json() as IPost[];
    },
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

### Edge Runtime Configuration
```tsx
// src/app/page.tsx:18
export const runtime = "edge";
```

## Experimental Streaming Benefits

**1. Progressive Loading**
- Components stream in as data becomes available
- Improved perceived performance
- Reduced time to first contentful paint
- Better user experience during loading

**2. Automatic State Transfer**
- Seamless server-to-client query state hydration
- No manual dehydration/rehydration needed
- Streaming query results during SSR
- Automatic cache population

**3. Edge Runtime Support**
- Faster cold starts with edge computing
- Reduced latency for global users
- Optimized for serverless environments
- Enhanced performance characteristics

**4. Future-Ready Architecture**
- Experimental features for next React versions
- Progressive enhancement patterns
- Streaming-first design
- Modern web performance optimizations

## Streaming vs Standard RSC + React Query

**Streaming Advantages:**
- Automatic hydration without manual setup
- Progressive component loading
- Better performance with edge runtime
- Simplified client/server state management

**Standard Approach Advantages:**
- More stable, production-ready APIs
- Manual control over prefetching strategy
- Explicit hydration boundaries
- Wider ecosystem compatibility

## Experimental Features Used

**ReactQueryStreamedHydration**: Automatic streaming of query states
**Edge Runtime**: Serverless edge computing environment
**Suspense Integration**: Native React Suspense support
**Client-Only Queries**: Pure client-side data fetching patterns

## When to Use Experimental Streaming

**Perfect For:**
- Cutting-edge applications willing to use experimental features
- Performance-critical applications needing progressive loading
- Edge-deployed applications requiring fast cold starts
- Teams wanting simplified RSC + React Query integration

**Considerations:**
- Experimental API may change
- Limited production battle-testing
- Potential breaking changes in updates
- Requires careful testing and monitoring

This experimental approach represents the future direction of React Query integration with React Server Components and streaming architectures.