# Modern Query Organization with queryOptions

This example demonstrates the modern, recommended approach to organizing React Query code using `queryOptions` - the current best practice that replaced custom hooks for better type safety and consistency.

## Key Learning Points

- **queryOptions Function**: The modern, officially recommended way to define reusable query configurations
- **Better TypeScript Inference**: Superior type safety compared to custom hooks approach
- **Consistent API**: Uniform interface for both `useQuery` and `useSuspenseQuery`
- **Easy Composition**: Query options can be easily extended and composed
- **Clean Query Key Management**: Query keys are encapsulated within the options
- **Framework Agnostic**: Query options work across different React Query hooks
- **Official TanStack Recommendation**: This is the current best practice from the TanStack team

## Code Examples

### Basic queryOptions Definition

```tsx
// queries/posts.ts:7-13
export const postsQueryOptions = queryOptions({
  queryKey: ["/posts"],
  queryFn: async () => {
    const response = await fetch(`${API_URL}/posts`);
    return response.json() as Promise<IPost[]>;
  },
});
```

### Parameterized queryOptions

```tsx
// queries/posts.ts:16-23
export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["/posts", postId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/posts/${postId}`);
      return response.json() as Promise<IPost>;
    },
  });
```

### Using queryOptions with Different Hooks

```tsx
// pages/HomePage.tsx:50 - With useSuspenseQuery
const { data: posts } = useSuspenseQuery(postsQueryOptions);

// pages/PostPage.tsx:35 - With useQuery
const { data: post, isLoading, isError } = useQuery(postQueryOptions(postId!));
```

### Extending queryOptions for Dependent Queries

```tsx
// pages/PostPage.tsx:42-45
const {
  data: user,
  isPending: isPendingUser,
  isError: isErrorLoadingUser,
} = useQuery({
  ...userQueryOptions(post?.userId!), // Spread the base options
  enabled: !!post?.userId, // Add additional configuration
});
```

### Query Key Access for Cache Management

```tsx
// pages/PostPage.tsx:81-84
onSettled: () => {
  queryClient.invalidateQueries({
    queryKey: postCommentsQueryOptions(postId!).queryKey, // Direct access to query key
  });
},
```

### Complex Query Options with Additional Configuration

```tsx
// queries/comments.ts:7-15
export const postCommentsQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["/posts", postId, "comments"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`);
      return response.json() as Promise<IComment[]>;
    },
    refetchInterval: 10000, // Additional configuration
  });
```

## Advantages Over Custom Hooks Pattern

**1. Better TypeScript Support**

- Improved type inference
- Consistent typing across different hooks
- Better intellisense and autocomplete

**2. More Flexible**

- Works with any React Query hook (`useQuery`, `useSuspenseQuery`, `useInfiniteQuery`, etc.)
- Easy to extend with additional options
- Framework-agnostic definitions

**3. Official Recommendation**

- Current best practice from TanStack team
- Future-proof approach
- Better documentation and community support

**4. Cleaner Code**

- Less boilerplate than custom hooks
- More declarative approach
- Easier to test and mock

This is the current recommended pattern for organizing React Query code in modern applications.
