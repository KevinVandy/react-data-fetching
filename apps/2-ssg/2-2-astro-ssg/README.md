# Astro Static Site Generation (SSG)

This example demonstrates Astro's built-in static site generation capabilities, showcasing how Astro pre-renders pages at build time using server-side code in the frontmatter and `getStaticPaths`.

## Key Learning Points

- **Frontmatter Data Fetching**: Fetch data at build time using JavaScript/TypeScript in the frontmatter
- **getStaticPaths**: Generate dynamic routes statically at build time
- **Zero JavaScript by Default**: Pages are completely static HTML unless explicitly hydrated
- **Component Islands**: Selective hydration for interactive components
- **Build-Time Only**: Server-side code runs only during build, not at runtime
- **Optimal Performance**: Minimal JavaScript, fast loading static HTML

## Code Examples

### Frontmatter Data Fetching for Homepage
```astro
---
// src/pages/index.astro:2-8
import Layout from "../layouts/Layout.astro";
import type { IPost } from "../api-types";

const response = await fetch("http://localhost:3300/posts");
const posts = (await response.json()) as IPost[];
---

<Layout title="Welcome to Astro.">
  <main class="flex-1 relative">
    <div class="container mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-center mb-12">Your Home Feed</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <a href={`/posts/${post.id}`} class="block">
            <div class="bg-white rounded-lg shadow-md p-6 h-full hover:shadow-lg transition-shadow">
              <h2 class="text-xl font-semibold mb-3">{post.title}</h2>
              <p class="text-gray-600 mb-4">{post.body}</p>
              <span class="text-blue-600 hover:text-blue-800">Go to post →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </main>
</Layout>
```

### Dynamic Route Generation
```astro
---
// src/pages/posts/[id].astro:3-18
import type { IPost } from "../../api-types";

export async function getStaticPaths() {
  const response = await fetch("http://localhost:3300/posts");
  const posts = (await response.json()) as IPost[];

  return posts.map((post) => ({
    params: { id: post.id.toString() },
    props: { post },
  }));
}

const { post } = Astro.props;
const { id } = Astro.params;
---
```

### Parallel Data Fetching in Dynamic Pages
```astro
---
// src/pages/posts/[id].astro:20-32
// Fetch user and comments data
const [userResponse, commentsResponse] = await Promise.all([
  fetch(`http://localhost:3300/users/${post.userId}`),
  fetch(`http://localhost:3300/posts/${id}/comments`),
]);

const user = (await userResponse.json()) as IUser;
const comments = (await commentsResponse.json()) as IComment[];
---

<Layout title={`Post: ${post.title}`}>
  <main class="flex-1 relative">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-4">Post: {post.id}</h1>
      <h2 class="text-2xl font-semibold mb-2">{post.title}</h2>
      <h3 class="text-lg mb-4">
        By: <a href={`/users/${user.id}`} class="text-blue-600 hover:underline">{user.name}</a>
      </h3>
      <p class="text-gray-700 mb-8">{post.body}</p>
    </div>
  </main>
</Layout>
```

### Static Comments Section
```astro
<!-- src/pages/posts/[id].astro:54-69 -->
<section class="bg-gray-50 py-8">
  <div class="container mx-auto px-4">
    <h3 class="text-xl font-semibold mb-6">Comments on this Post</h3>
    <div class="space-y-4">
      {comments.map((comment) => (
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <h4 class="font-semibold text-lg">{comment.name}</h4>
          <p class="text-sm text-gray-500 mb-2">{comment.email}</p>
          <p class="text-gray-700">{comment.body}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

## Benefits of Astro SSG

**1. Minimal JavaScript**
- Zero JavaScript shipped by default
- Only hydrate components that need interactivity
- Drastically smaller bundle sizes

**2. Excellent Performance**
- Static HTML files served directly
- No hydration overhead for static content
- Perfect Core Web Vitals scores

**3. Developer Experience**
- Use any UI framework (React, Vue, Svelte, etc.)
- Component islands for selective hydration
- TypeScript support out of the box

**4. SEO Optimization**
- All content is server-rendered at build time
- Complete HTML available for search crawlers
- Fast loading times improve rankings

## Astro vs Next.js SSG

**Astro Advantages:**
- Zero JavaScript by default
- Use multiple frameworks in one project
- Better performance for content-heavy sites
- Simpler mental model for static sites

**Next.js Advantages:**
- More mature ecosystem
- Better for React-heavy applications
- ISR (Incremental Static Regeneration)
- More deployment options

## When to Use Astro SSG

**Perfect For:**
- Content-heavy websites
- Blogs and documentation
- Marketing sites
- Portfolio sites
- Any site that doesn't need much interactivity

**Consider Next.js Instead When:**
- You need extensive client-side interactivity
- Building a React-centric application
- You need ISR or other advanced Next.js features
- Team is already invested in React ecosystem

This approach delivers the fastest possible loading times while maintaining excellent developer experience and SEO optimization.