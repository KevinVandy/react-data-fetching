# Astro Server Islands

This example demonstrates Astro's server islands feature with deferred HTML streaming, showing how components can be rendered on the server with artificial delays while streaming progressive content to the client, similar to React Server Components but with Astro's unique approach.

## Key Learning Points

- **Server Islands**: Components that render on server but stream separately
- **server:defer Directive**: Deferred server-side rendering with fallback UI
- **Streaming HTML**: Progressive page loading with placeholder content
- **Astro Actions**: Server-side functions for handling form submissions
- **Fallback Slots**: Loading states during server component rendering
- **Progressive Enhancement**: Forms work without JavaScript, enhanced with actions

## Code Examples

### Server Island with Deferred Loading
```astro
<!-- src/pages/index.astro:6-13 -->
<Layout>
  <HomeFeed server:defer>
    <div slot="fallback" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900">
      </div>
    </div>
  </HomeFeed>
</Layout>
```

### Server Component with Artificial Delay
```astro
---
// src/components/HomeFeed.astro:4-17
const fetchPosts = async (): Promise<{ posts: IPost[]; error: boolean }> => {
  try {
    // Add artificial delay to demonstrate streaming
    await new Promise((resolve) => setTimeout(resolve, 1000));
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

### Nested Server Islands
```astro
<!-- src/pages/posts/[id].astro:54-58 -->
<Comments postId={postId} server:defer>
  <div slot="fallback" class="flex justify-center items-center py-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
</Comments>
```

### Server Component with Caching Headers
```astro
---
// src/components/Comments.astro:10-20
await new Promise((resolve) => setTimeout(resolve, 3000));
const commentsResponse = await fetch(
  `http://localhost:3300/posts/${postId}/comments`,
  {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
    },
  }
);
const comments = (await commentsResponse.json()) as IComment[];
---
```

### Astro Actions for Form Handling
```typescript
// src/actions/index.ts:4-44
export const server = {
  addComment: defineAction({
    accept: "form",
    input: z.object({
      postId: z.string(),
      text: z.string(),
    }),
    handler: async ({ postId, text }) => {
      try {
        const newComment = {
          body: text,
          email: "user@mailinator.com",
          name: "User",
          postId: Number(postId),
        };

        const response = await fetch("http://localhost:3300/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newComment),
        });

        if (!response.ok) throw new Error("Failed to create comment");
        return { success: true };
      } catch (error) {
        return { success: false, error: "Error creating comment" };
      }
    },
  }),
};
```

### Client-Side Enhancement Script
```javascript
// src/components/Comments.astro:117-129
<script>
  import { actions } from "astro:actions";

  const form = document.querySelector("#comment-form") as HTMLFormElement;
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const { error } = await actions.addComment(formData);
    if (!error) {
      form.reset();
      location.reload();
    }
  });
</script>
```

## Astro Server Islands Benefits

**1. Streaming Performance**
- Components render independently on server
- Progressive page loading with fallback content
- Reduced time to first contentful paint
- Better perceived performance during loading

**2. Zero JavaScript by Default**
- Server islands render pure HTML
- No client-side hydration overhead
- Optional JavaScript enhancement
- Minimal browser processing required

**3. Flexible Caching**
- Per-component cache control headers
- Independent cache invalidation
- Server-side performance optimization
- CDN-friendly architecture

**4. Progressive Enhancement**
- Forms work without JavaScript
- Enhanced with Astro actions
- Graceful degradation patterns
- Accessibility-first approach

## Server Islands vs React Server Components

**Astro Server Islands:**
- Pure HTML streaming without client hydration
- Component-level caching strategies
- `server:defer` directive for deferred loading
- Minimal JavaScript footprint
- Astro actions for server mutations

**React Server Components:**
- Server components with client component hydration
- Server actions and optimistic updates
- `use server` directive patterns
- Full React ecosystem integration
- More complex client/server boundaries

## Astro-Specific Patterns

**server:defer**: Stream component separately with fallback UI
**Fallback Slots**: Loading states during server rendering
**Astro Actions**: Type-safe server functions for form handling
**Component Islands**: Independent server/client rendering strategies

## When to Use Astro Server Islands

**Perfect For:**
- Content-heavy sites with dynamic sections
- Applications prioritizing performance over interactivity
- Sites requiring minimal JavaScript
- Progressive enhancement architectures
- SEO-critical applications with some dynamic content

**Limitations:**
- Limited client-side interactivity compared to RSC
- No optimistic updates or advanced state management
- Less mature ecosystem for complex interactions
- Requires page reloads for data mutations

Astro Server Islands provide excellent performance with streaming HTML while maintaining simplicity and minimal JavaScript overhead, making them ideal for content-focused applications with selective interactivity.