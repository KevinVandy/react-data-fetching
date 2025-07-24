# React Router v7 Server-Side Rendering (SSR)

This example demonstrates React Router v7 framework mode with server-side rendering, showcasing how the router loads data on the server using loaders and actions, combined with React Query for enhanced client-side data management and optimistic updates.

## Key Learning Points

- **React Router v7 Framework Mode**: Full-stack React application with file-based routing
- **Loader Functions**: Server-side data fetching that runs before route components render
- **Action Functions**: Server-side form handling and mutations
- **SSR + React Query Hybrid**: Initial data from server, enhanced client functionality
- **Progressive Enhancement**: Forms work without JavaScript, enhanced with client-side features
- **Initial Data Pattern**: Using server data as initial state for React Query

## Code Examples

### Route Loader for Homepage

```tsx
// app/routes/_index.tsx:12-30
export const loader: LoaderFunction = async () => {
  try {
    const fetchUrl = new URL(`http://localhost:3300/posts`);
    const response = await fetch(fetchUrl.href);
    const fetchedPosts = (await response.json()) as IPost[];

    return {
      posts: fetchedPosts,
      error: false,
    };
  } catch (error) {
    console.error(error);

    return {
      posts: [],
      error: true,
    };
  }
};
```

### Dynamic Route with Parallel Data Loading

```tsx
// app/routes/posts.$id.tsx:31-59
export const loader: LoaderFunction = async ({ params }) => {
  const { id: postId } = params;

  try {
    // Parallel data fetching on server
    const [postResponse, commentsResponse] = await Promise.all([
      fetch(`http://localhost:3300/posts/${postId}`),
      fetch(`http://localhost:3300/posts/${postId}/comments`),
    ]);

    const [initialPost, initialComments] = await Promise.all([
      postResponse.json(),
      commentsResponse.json(),
    ]);

    return {
      initialPost,
      initialComments,
      error: false,
    };
  } catch (error) {
    console.error(error);
    return {
      initialPost: null,
      initialComments: null,
      error: true,
    };
  }
};
```

### Server Action for Form Handling

```tsx
// app/routes/posts.$id.tsx:62-87
export const action: ActionFunction = async ({ request }) => {
  const returnData = { data: {}, errors: {}, success: false };

  const data = Object.fromEntries(await request.formData()) as unknown as Omit<
    IComment,
    "id"
  >;

  try {
    const response = await fetch(`http://localhost:3300/comments`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    returnData.data = await response.json();
    returnData.success = true;
  } catch (error) {
    console.error(error);
    returnData.errors = {
      comment: "Error posting comment",
    };
  }
  return returnData;
};
```

### Hybrid SSR + React Query Pattern

```tsx
// app/routes/posts.$id.tsx:122-153
// Load post - with initial data from SSR
const {
  data: post,
  isPending: isPendingPost,
  isError: isErrorLoadingPosts,
} = useQuery({
  queryKey: ["post", postId],
  queryFn: async () => {
    const response = await fetch(`http://localhost:3300/posts/${postId}`);
    return response.json() as Promise<IPost>;
  },
  initialData: initialPost, // SSR data as initial state
});

// Load comments - with initial data from SSR
const {
  data: comments,
  isPending: isPendingComments,
  isFetching: isFetchingComments,
  isError: isErrorLoadingComments,
  refetch: refetchComments,
} = useQuery({
  queryKey: ["comments", postId],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:3300/posts/${postId}/comments`
    );
    return response.json() as Promise<IComment[]>;
  },
  initialData: initialComments, // SSR data as initial state
  refetchInterval: 10000, // Client-side polling
});
```

### Progressive Enhancement Form

```tsx
// app/routes/posts.$id.tsx:316-341
<Form method="post">
  <input type="hidden" name="postId" value={postId} />
  <input type="hidden" name="email" value="user@mailinator.com" />
  <input type="hidden" name="name" value="User" />
  <Stack gap="md">
    <Textarea
      name="body"
      disabled={isPostingComment}
      label="Post a Comment"
      onChange={(e) => setCommentText(e.target.value)}
      value={commentText}
    />
    <Button
      type="submit"
      disabled={isPostingComment || commentText.length === 0}
      leftSection={
        isPostingComment ? (
          <Loader variant="oval" color="white" size="xs" />
        ) : null
      }
    >
      Post Comment
    </Button>
  </Stack>
</Form>
```

### Action Data Handling

```tsx
// app/routes/posts.$id.tsx:106-117
const actionData: any = useActionData<typeof action>();

useEffect(() => {
  refetchComments(); // Refresh comments after posting
  if (actionData?.success) {
    setCommentText(""); // Clear comment field on success
  }
}, [actionData]);

const navigation = useNavigation();
const isPostingComment = navigation.state === "submitting";
```

## Benefits of React Router v7 SSR

**1. Full-Stack Framework**

- Server-side rendering with data loading
- Progressive enhancement out of the box
- Form handling without JavaScript required
- Type-safe data loading and mutations

**2. Performance Advantages**

- No loading states for initial page data
- Instant page transitions with prefetched data
- Progressive enhancement reduces JavaScript dependency
- Optimized bundle splitting

**3. Developer Experience**

- File-based routing convention
- Type-safe loaders and actions
- Built-in form state management
- Hot module replacement during development

**4. Hybrid Architecture**

- Server data loading + client-side enhancements
- React Query for advanced caching and mutations
- Progressive enhancement patterns
- Flexible data fetching strategies

## SSR + React Query Hybrid Pattern

This example demonstrates a powerful pattern:

**1. Server-Side Initial Load**

- Route loaders fetch critical data on server
- No loading states for initial render
- SEO-friendly with complete HTML

**2. Client-Side Enhancement**

- React Query uses server data as `initialData`
- Enables real-time updates, polling, optimistic updates
- Advanced caching and invalidation strategies

**3. Progressive Enhancement**

- Forms work without JavaScript via actions
- Enhanced with React Query mutations for better UX
- Graceful degradation for low-JS environments

## Comparison with Other SSR Approaches

**vs Next.js SSR (3-1):**

- More explicit data loading patterns
- Better form handling with progressive enhancement
- Type-safe loaders vs getServerSideProps
- Built-in navigation states and pending UI

**vs Pure React Query SPA:**

- Eliminates initial loading states
- Better SEO and perceived performance
- Server-side form handling as fallback
- Maintains all React Query benefits

**vs Traditional SSR:**

- Modern React patterns with hooks
- Enhanced client-side functionality
- Type-safe data contracts
- Better error boundaries and loading states

## When to Use React Router v7 SSR

**Perfect For:**

- Full-stack React applications
- Apps requiring both SSR performance and SPA features
- E-commerce sites with server-side cart logic
- Dashboards with real-time updates
- Content management systems

**Requirements:**

- Node.js deployment environment
- Need for server-side data processing
- Progressive enhancement requirements
- Type-safe full-stack development

This approach provides the best of both worlds: server-side rendering performance with modern client-side React patterns and enhanced interactivity.
