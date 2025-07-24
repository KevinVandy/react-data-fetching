# Data Fetching with TanStack Query (React Query)

This example demonstrates professional-grade data fetching using TanStack Query (formerly React Query), showing how to replace manual state management with a powerful data synchronization library.

## Key Learning Points

- **TanStack Query (@tanstack/react-query)**: Professional data fetching and state management library
- **useQuery Hook**: Declarative data fetching with automatic caching, background updates, and error handling
- **useMutation Hook**: Handles data mutations (POST, PUT, DELETE) with optimistic updates
- **Query Keys**: Unique identifiers for cached data with dependency-based invalidation
- **Optimistic Updates**: UI updates immediately before server confirmation for better UX
- **Background Refetching**: Automatic data synchronization and staleness management
- **Dependent Queries**: Queries that depend on data from other queries using `enabled` option

## Code Examples

### Basic Query Usage

```tsx
// HomePage.tsx:19-32
const {
  data: posts,
  isError: isErrorLoadingPosts,
  isFetching: isFetchingPosts,
  isPending: isPendingPosts,
} = useQuery({
  queryKey: ["posts"],
  queryFn: async () => {
    const fetchUrl = new URL(`http://localhost:3300/posts`);
    const response = await fetch(fetchUrl.href);
    return response.json() as Promise<IPost[]>;
  },
});
```

### Dependent Queries with Enabled Option

```tsx
// PostPage.tsx:41-54
const {
  data: user,
  isPending: isPendingUser,
  isError: isErrorLoadingUser,
} = useQuery({
  enabled: !!post?.userId, // Only run when post.userId exists
  queryKey: ["users", post?.userId],
  queryFn: async () => {
    const response = await fetch(`http://localhost:3300/users/${post?.userId}`);
    return response.json() as Promise<IUser>;
  },
});
```

### Background Refetching

```tsx
// PostPage.tsx:57-72
const {
  data: comments,
  isPending: isPendingComments,
  isFetching: isFetchingComments,
  isError: isErrorLoadingComments,
  refetch: refetchComments,
} = useQuery({
  queryKey: ["posts", postId, "comments"],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:3300/posts/${postId}/comments`
    );
    return response.json() as Promise<IComment[]>;
  },
  refetchInterval: 10000, // Auto-refetch every 10 seconds
});
```

### Mutations with Optimistic Updates

```tsx
// PostPage.tsx:108-160
const { mutate: postComment, isPending: isPostingComment } = useMutation({
  mutationFn: async (comment: Omit<IComment, "id">) => {
    const response = await fetch(`http://localhost:3300/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    return response.json() as Promise<IComment>;
  },
  // Optimistic update - UI changes immediately
  onMutate: async (newComment) => {
    await queryClient.cancelQueries({
      queryKey: ["posts", postId, "comments"],
    });

    const previousComments = queryClient.getQueryData([
      "posts",
      postId,
      "comments",
    ]);

    // Update UI optimistically
    queryClient.setQueryData(
      ["posts", postId, "comments"],
      (oldComments: any) => [...oldComments, newComment]
    );

    return { previousComments };
  },
  // Rollback on error
  onError: (err, _newComment, context) => {
    queryClient.setQueryData(
      ["posts", postId, "comments"],
      context?.previousComments
    );
  },
  // Refresh data after success/error
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
  },
});
```

### Query Invalidation for Cache Management

```tsx
// PostPage.tsx:98-102
onSettled: () => {
  queryClient.invalidateQueries({
    queryKey: ["posts", postId, "comments"],
  }); // Refresh comments after deletion
},
```
