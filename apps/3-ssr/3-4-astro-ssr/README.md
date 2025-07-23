# Astro Server-Side Rendering (SSR)

This example demonstrates Astro's server-side rendering capabilities with API endpoints, showing how Astro handles dynamic server-rendered pages with form-based interactions and server API routes, providing a traditional web experience with modern tooling.

## Key Learning Points

- **Astro SSR Configuration**: Server output mode for dynamic rendering
- **Frontmatter Data Fetching**: Server-side data loading in Astro component frontmatter
- **API Routes**: Server-side endpoints for handling form submissions and mutations
- **Form-Based Interactions**: Traditional HTML forms with server-side processing
- **Server-Side Redirects**: Handling form submissions with redirect patterns
- **Mixed Static/Dynamic Generation**: Using both `getStaticPaths` and server rendering

## Code Examples

### Astro Config for SSR Mode

```javascript
// astro.config.mjs:7-12
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server", // Enable server-side rendering
});
```

### Server-Side Data Fetching in Frontmatter

```astro
---
// src/pages/index.astro:5-16
const fetchPosts = async (): Promise<{ posts: IPost[]; error: boolean }> => {
  try {
    const response = await fetch("http://localhost:3300/posts");
    const fetchedPosts = (await response.json()) as IPost[];
    return { posts: fetchedPosts, error: false };
  } catch (error) {
    console.error(error);
    return { posts: [], error: true };
  }
};

const { posts, error } = await fetchPosts();
---
```

### Dynamic Route with Hybrid Generation

```astro
---
// src/pages/posts/[id].astro:5-40
export async function getStaticPaths() {
  const response = await fetch(`http://localhost:3300/posts`);
  const posts = (await response.json()) as IPost[];

  return posts.map((post) => ({
    params: { id: post.id.toString() },
  }));
}

const { id: postId } = Astro.params;

let post: IPost;
let comments: IComment[];
let user: IUser;

try {
  // Parallel data fetching on server
  const [postResponse, commentsResponse] = await Promise.all([
    fetch(`http://localhost:3300/posts/${postId}`),
    fetch(`http://localhost:3300/posts/${postId}/comments`),
  ]);

  [post, comments] = (await Promise.all([
    postResponse.json(),
    commentsResponse.json(),
  ])) as [IPost, IComment[]];

  // Sequential fetch for user data
  const userResponse = await fetch(
    `http://localhost:3300/users/${post.userId}`
  );
  user = (await userResponse.json()) as IUser;
} catch (error) {
  console.error(error);
  return Astro.redirect("/error");
}
---
```

### API Route for Comment Creation

```typescript
// src/pages/api/add-comment.ts:3-42
export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const body = formData.get("body");
    const url = new URL(request.url);
    const postId = url.searchParams.get("postId");
    const redirectHash = url.searchParams.get("redirectHash");

    if (!body || !postId) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newComment = {
      body,
      email: "user@mailinator.com",
      name: "User",
      postId: Number(postId),
    };

    const response = await fetch("http://localhost:3300/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    if (!response.ok) throw new Error("Failed to create comment");

    // Redirect back to post with hash anchor
    const redirectUrl = new URL(
      `/posts/${postId}${redirectHash ? "#" + redirectHash : ""}`,
      url.origin,
    );
    return Response.redirect(redirectUrl.toString(), 303);
  } catch (error) {
    console.error("Error creating comment:", error);
    return new Response("Error creating comment", { status: 500 });
  }
};
```

### API Route for Comment Deletion

```typescript
// src/pages/api/delete-comment.ts:3-33
export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const commentId = formData.get("commentId");
    const postId = formData.get("postId");
    const url = new URL(request.url);
    const redirectHash = url.searchParams.get("redirectHash");

    if (!commentId || !postId) {
      return new Response("Missing required fields", { status: 400 });
    }

    const response = await fetch(
      `http://localhost:3300/comments/${commentId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) throw new Error("Failed to delete comment");

    const redirectUrl = new URL(
      `/posts/${postId}${redirectHash ? "#" + redirectHash : ""}`,
      url.origin,
    );
    return Response.redirect(redirectUrl.toString(), 303);
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new Response("Error deleting comment", { status: 500 });
  }
};
```

### Form-Based Comment Submission

```astro
<!-- src/pages/posts/[id].astro:130-153 -->
<form
  method="POST"
  action={`/api/add-comment?postId=${postId}&redirectHash=comments`}
  class="space-y-4"
  enctype="multipart/form-data"
>
  <div>
    <label for="comment" class="block text-sm font-medium text-gray-700"
      >Post a Comment</label>
    <textarea
      id="comment"
      name="body"
      rows="3"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      required></textarea>
  </div>
  <button
    type="submit"
    class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Post Comment
  </button>
</form>
```

### Form-Based Comment Deletion

```astro
<!-- src/pages/posts/[id].astro:91-119 -->
{comment.email === "user@mailinator.com" && (
  <form
    method="POST"
    action={`/api/delete-comment?redirectHash=comments`}
    class="absolute right-2 top-2"
  >
    <input type="hidden" name="commentId" value={comment.id} />
    <input type="hidden" name="postId" value={postId} />
    <button
      type="submit"
      class="text-red-600 hover:text-red-800"
      title="Delete comment"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 7l16 0" />
        <path d="M10 11l0 6" />
        <path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
      </svg>
    </button>
  </form>
)}
```

## Benefits of Astro SSR

**1. Traditional Web Model Enhanced**

- HTML forms work without JavaScript
- Progressive enhancement approach
- Server-side processing with modern tooling
- SEO-friendly by default

**2. Performance Characteristics**

- Zero client-side JavaScript by default
- Server-side rendering for all content
- Optimal loading performance
- Minimal bandwidth usage

**3. Developer Experience**

- Familiar component frontmatter patterns
- File-based API routing
- TypeScript support throughout
- Simple deployment model

**4. Hybrid Approach**

- Mix static and dynamic generation strategies
- API routes for server-side logic
- Form-based interactions with redirects
- Traditional request/response patterns

## Astro SSR Patterns

**1. Frontmatter Data Fetching**

- Server-side data loading in component script
- Async operations before rendering
- Error handling with redirects
- Direct variable access in templates

**2. API Route Architecture**

- RESTful endpoints with Astro conventions
- FormData processing for HTML forms
- Server-side redirects after mutations
- Standard HTTP response patterns

**3. Form-First Interactions**

- HTML forms as primary interaction method
- Server-side validation and processing
- Redirect-after-POST pattern
- Hash-based navigation for UX

## Comparison with Other SSR Approaches

**vs SvelteKit SSR (3-3):**

- Zero-JS by default vs. selective hydration
- Form-based interactions vs. reactive components
- Traditional server patterns vs. modern reactive patterns
- API routes vs. server actions

**vs React Router SSR (3-2):**

- No client-side JavaScript framework overhead
- HTML forms vs. React component interactions
- Server redirects vs. programmatic navigation
- Simple request/response vs. complex state management

**vs Next.js SSR (3-1):**

- Component-first vs. page-first architecture
- API routes integrated vs. separate API layer
- Zero JavaScript vs. React hydration
- File-based routing for both pages and APIs

## When to Use Astro SSR

**Perfect For:**

- Content-heavy websites with minimal interactivity
- Performance-critical applications
- Sites requiring zero JavaScript
- Traditional web application patterns
- SEO-focused content sites

**Requirements:**

- Minimal client-side interactivity needs
- Performance is the primary concern
- Traditional web development preferences
- Server-side processing capabilities

**Avoid When:**

- Rich interactive applications needed
- Real-time features required
- Complex client-side state management
- Heavy use of interactive components

Astro SSR provides excellent performance with a traditional web development model, making it ideal for content sites and applications where performance and simplicity are paramount.
