# Custom Hooks for React Query Organization

This example demonstrates how to organize React Query code into reusable custom hooks, making data fetching logic more modular and maintainable. This was a popular pattern before `queryOptions` became the preferred approach.

## Key Learning Points

- **Custom Hooks Pattern**: Encapsulating React Query logic in custom hooks for reusability
- **Query Key Functions**: Centralized query key management with exported functions
- **useSuspenseQuery**: Using Suspense-compatible queries with error boundaries
- **React Error Boundary**: Proper error handling with `QueryErrorResetBoundary` and `ErrorBoundary`
- **Component Separation**: Breaking UI into smaller, focused components
- **Prefetching Functions**: Exposing prefetch functions for performance optimization
- **Legacy Pattern**: This approach has been superseded by `queryOptions` in modern React Query

## Code Examples

### Custom Hook Structure

```tsx
// hooks/useGetPosts.ts:7-22
export const getPostsQueryKey = () => [ENDPOINT];

function commonOptions() {
  return {
    queryKey: getPostsQueryKey(),
    queryFn: async () => {
      const fetchUrl = new URL(`${API_URL}${ENDPOINT}`);
      const response = await fetch(fetchUrl.href);
      return response.json() as Promise<IPost[]>;
    },
  };
}

export function useGetPosts() {
  return useSuspenseQuery(commonOptions());
}

export function prefetchPosts(queryClient: QueryClient) {
  queryClient.prefetchQuery(commonOptions());
}
```

### Using Custom Hooks in Components

```tsx
// pages/HomePage.tsx:48-49
function HomePagePosts() {
  const { data: posts } = useGetPosts();
  // Component can assume data is loaded (Suspense handles loading)
}
```

### Query Key Management

```tsx
// hooks/useGetPostComments.ts:7
export const getPostCommentsQueryKey = (postId: string) => [ENDPOINT(postId)];

// Used in mutations for cache invalidation
// pages/PostPage.tsx:81-83
onSettled: () => {
  queryClient.invalidateQueries({
    queryKey: getPostCommentsQueryKey(postId!),
  });
},
```

### Suspense-Based Loading with Error Boundaries

```tsx
// pages/HomePage.tsx:14-25
<QueryErrorResetBoundary>
  {({ reset }) => (
    <ErrorBoundary fallbackRender={() => <HomePageError />} onReset={reset}>
      <Suspense fallback={<HomePageSkeleton />}>
        <HomePagePosts />
      </Suspense>
    </ErrorBoundary>
  )}
</QueryErrorResetBoundary>
```

### Dependent Queries with Enabled Option

```tsx
// hooks/useGetUser.ts:19-24
export function useGetUser(userId?: number) {
  return useQuery({
    ...commonOptions(userId),
    enabled: !!userId, // Only run when userId exists
  });
}
```

## Why This Pattern Is Now Legacy

While this custom hooks pattern was popular, the newer `queryOptions` pattern (shown in the next example) provides:

- **Better TypeScript inference**
- **More consistent API**
- **Easier composition and reuse**
- **Official recommendation from TanStack Query team**

This example remains valuable for understanding how React Query code organization evolved and may still be found in existing codebases.
