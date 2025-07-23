# Next.js React Server Components (RSC)

This example demonstrates Next.js App Router with React Server Components, showing how server components handle data fetching and streaming while client components manage interactivity with server actions and optimistic updates.

## Key Learning Points

- **React Server Components**: Components that run only on the server
- **Server Actions**: Functions that run on server, called from client components
- **Optimistic Updates**: `useOptimistic` for instant UI feedback
- **Server/Client Boundary**: Clear separation with "use client" directive
- **Progressive Enhancement**: Forms work without JavaScript
- **Streaming**: Automatic streaming of server-rendered content

## Code Examples

### Server Component with Data Fetching

```tsx
// src/app/page.tsx:13-48
export default async function HomePage() {
  const posts = await fetchPosts(); // Fetch directly in server component

  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
      <Flex gap="md" wrap="wrap">
        <Suspense fallback={<Loader />}>
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Card>
                <Title order={3}>{post.title}</Title>
                <Text>{post.body}</Text>
                <Text c="blue" pt="md">
                  Go to post
                </Text>
              </Card>
            </Link>
          ))}
        </Suspense>
      </Flex>
    </Stack>
  );
}
```

### Server Component with Parallel Data Fetching

```tsx
// src/app/posts/[id]/page.tsx:6-22
const fetchPostAndComments = async (postId: number) => {
  // Parallel data fetching on server
  const [post, comments] = await Promise.all([
    fetch(`http://localhost:3300/posts/${postId}`).then((res) => res.json()),
    fetch(`http://localhost:3300/posts/${postId}/comments`).then((res) =>
      res.json(),
    ),
  ]);

  // Sequential fetch for user data
  const user = await fetch(`http://localhost:3300/users/${post.userId}`).then(
    (res) => res.json(),
  );

  return { post, user, comments };
};

export default async function PostPage({ params }: PostPageProps) {
  const { post, user, comments } = await fetchPostAndComments(+params.id);
  // Server component passes data to client component
  return <CommentSection comments={comments} postId={post.id} />;
}
```

### Server Actions

```tsx
// src/app/posts/[id]/actions.tsx:16-30
"use server";

export const submitPostComment = async (formData: FormData) => {
  const comment = Object.fromEntries(formData.entries()) as unknown as IComment;

  const response = await fetch(`http://localhost:3300/comments`, {
    method: "POST",
    body: JSON.stringify(comment),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  revalidatePath(`/posts/${comment.postId}`); // Revalidate server component
  return response.json() as Promise<IComment>;
};
```

### Client Component with Optimistic Updates

```tsx
// src/app/posts/[id]/CommentSection.tsx:33-52
"use client";

export default function CommentSection({
  comments,
  postId,
}: CommentSectionProps) {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (currentComments: IComment[], newComment: IComment) => {
      return [...currentComments, newComment];
    },
  );

  async function optimisticallyPostComment(formData: FormData) {
    // Add optimistic comment immediately
    addOptimisticComment({
      postId,
      id: 0,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      body: formData.get("body") as string,
      sending: true,
    });
    formRef.current?.reset();
    await submitPostComment(formData); // Call server action
  }

  return <form action={optimisticallyPostComment}>{/* Form content */}</form>;
}
```

## React Server Components Architecture

**Server Components:**

- Run only on server during build/request
- Can directly access databases and APIs
- Cannot use client-side features (useState, useEffect, etc.)
- Automatically streamed to client

**Client Components:**

- Run on both server (for SSR) and client
- Handle interactivity and browser APIs
- Must be marked with "use client" directive
- Receive props from server components

**Server Actions:**

- Functions that run on server but are called from client
- Marked with "use server" directive
- Enable form submissions and mutations
- Can revalidate server component data

## RSC vs Traditional SSR

**Server Components:**

- Zero JavaScript sent for server components
- Direct server data access (no API layer needed)
- Automatic code splitting and streaming
- Server-side rendering with client interactivity

**Traditional SSR:**

- Full page hydration with JavaScript
- API calls needed for data fetching
- Manual optimization for performance
- Waterfall requests for nested data

## When to Use RSC

**Perfect For:**

- Applications with mix of static and interactive content
- Reducing client-side JavaScript bundle size
- Direct database access without API layer
- SEO-critical applications with rich interactivity

React Server Components provide the best of both worlds: server-side performance with seamless client-side interactivity.
