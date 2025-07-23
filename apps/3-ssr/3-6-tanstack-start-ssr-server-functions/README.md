# TanStack Start Server Functions

This example demonstrates TanStack Start's server functions - logic that runs only on the server but can be called from anywhere (server or client). Unlike Next.js server functions, these provide type-safe, validated RPC-style calls with automatic compilation and extraction.

## Key Learning Points

- **Server Functions**: Type-safe RPC calls that run only on server
- **Automatic Compilation**: Functions automatically extracted from client bundles
- **Runtime Validation**: Zod integration for input validation and type safety
- **Universal Calling**: Call from server-side loaders, client-side code, or other server functions
- **Deferred Data Loading**: Stream non-critical data with skeleton states
- **Seamless Integration**: Works naturally with React Query patterns

## Code Examples

### Basic Server Function

```typescript
// src/server-functions/posts.ts:7-13
export const getPosts = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const response = await fetch(`${API_URL}/posts`);
  return response.json() as Promise<IPost[]>;
});
```

### Server Function with Validation

```typescript
// src/server-functions/posts.ts:16-24
export const getPost = createServerFn({
  method: "GET",
  response: "data",
})
  .validator((data: string) => data)
  .handler(async (ctx) => {
    const response = await fetch(`${API_URL}/posts/${ctx.data}`);
    return response.json() as Promise<IPost>;
  });
```

### Zod Schema Validation

```typescript
// src/server-functions/comments.ts:10-25
const CreateCommentSchema = z.object({
  postId: z.number(),
  name: z.string(),
  email: z.email(),
  body: z.string(),
});

export const createComment = createServerFn({
  method: "POST",
  response: "data",
})
  .validator((data: unknown) => {
    return CreateCommentSchema.parse(data);
  })
  .handler(async (ctx) => {
    const response = await fetch(`${API_URL}/comments`, {
      method: "POST",
      body: JSON.stringify(ctx.data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    return response.json() as Promise<IComment>;
  });
```

### Route Loader with Deferred Data

```tsx
// src/routes/posts.$id.tsx:37-56
export const Route = createFileRoute("/posts/$id")({
  loader: async ({ context: { queryClient }, params: { id } }) => {
    // First load the post using server function
    const post = await getPost({ data: id });
    queryClient.setQueryData(postQueryOptions(id).queryKey, post);

    // Load user immediately
    const user = await getUser({ data: post.userId });
    queryClient.setQueryData(userQueryOptions(post.userId).queryKey, user);

    // Defer comments loading - return the promise without awaiting
    const deferredComments = getPostComments({ data: id }).then((comments) => {
      queryClient.setQueryData(postCommentsQueryOptions(id).queryKey, comments);
      return comments;
    });

    return {
      deferredComments,
    };
  },
  component: PostPage,
});
```

### React Query Integration

```typescript
// src/queries/posts.ts:4-8
export const postsQueryOptions = queryOptions({
  queryKey: ["/posts"],
  queryFn: () => getPosts(), // Direct server function call
});
```

### Deferred Data with Suspense and Skeletons

```tsx
// src/routes/posts.$id.tsx:243-284
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
// src/routes/posts.$id.tsx:60-74
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

### Client-Side Mutations

```tsx
// src/routes/posts.$id.tsx:115-117
const { mutate: postComment } = useMutation({
  mutationFn: (comment: Omit<IComment, "id">) =>
    createComment({ data: comment }), // Server function in mutation
});
```

## Server Functions vs Next.js

**TanStack Start Server Functions:**

- Universal calling (server + client)
- Automatic compilation and extraction
- Built-in validation with type inference
- RPC-style with explicit data parameter
- Framework-agnostic HTTP requests

**Next.js Server Functions:**

- Server components and actions only
- Manual "use server" directive placement
- Form-based or manual validation
- Tightly coupled to React Server Components
- Next.js-specific implementation

## Benefits

**1. Type Safety**

- Full type inference from validator to handler
- Compile-time checks for parameter types
- Runtime validation with Zod schemas

**2. Developer Experience**

- Call server functions like regular functions
- Automatic client/server boundary handling
- No manual serialization/deserialization

**3. Flexibility**

- Use in loaders, queries, mutations, anywhere
- Support for various data types (JSON, FormData, primitives)
- Built-in error handling and redirects
- Deferred loading for progressive data streaming

## When to Use Server Functions

**Perfect For:**

- Type-safe server/client communication
- Replacing traditional API routes
- Validated data mutations
- Server-side data processing with client calls

TanStack Start server functions provide the most seamless and type-safe way to bridge server and client code in React applications.
