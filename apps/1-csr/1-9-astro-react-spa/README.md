# SPA Portal within Astro Static Site

This example demonstrates a unique hybrid architecture where a React SPA lives within an Astro static site, showcasing how modern frameworks can be combined for different use cases within the same application.

## Key Learning Points

- **Hybrid Architecture**: Static Astro pages combined with a dynamic React SPA portal
- **Astro Islands**: Using `client:only` to render React components entirely on the client
- **Catch-All Routing**: Astro's `[...slug].astro` pattern to handle SPA routes
- **Static Path Generation**: Pre-generating known SPA routes at build time for SEO
- **Framework Integration**: Seamless transition between static and dynamic content
- **Best of Both Worlds**: Static performance for content, SPA interactivity for dynamic features

## Architecture Overview

```
/                     → Static Astro page (index.astro)
/spa                  → React SPA entry point
/spa/posts/123        → React SPA route (handled by [...slug].astro)
/spa/users            → React SPA route (handled by [...slug].astro)
```

## Code Examples

### Static Entry Page
```astro
<!-- src/pages/index.astro:8-20 -->
<div class="text-center">
  <h1 class="text-5xl font-bold mb-6">Static Astro Page</h1>
  <p class="text-xl text-gray-600 mb-12">
    This is a static page built with Astro. Click below to visit the SPA portal.
  </p>
  <a href="/spa" class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
    Go to SPA Portal
  </a>
</div>
```

### SPA Portal with Catch-All Routing
```astro
<!-- src/pages/spa/[...slug].astro:25-27 -->
<Layout>
  <App client:only />
</Layout>
```

### Pre-generating SPA Routes for SEO
```astro
<!-- src/pages/spa/[...slug].astro:6-20 -->
export async function getStaticPaths() {
  const users = await fetch("http://localhost:3300/users");
  const usersData = (await users.json()) as IUser[];
  const posts = await fetch("http://localhost:3300/posts");
  const postsData = (await posts.json()) as IPost[];

  const paths = [
    { params: { slug: undefined } },           // /spa
    { params: { slug: "users" } },             // /spa/users
    ...usersData.map((user) => ({ 
      params: { slug: `users/${user.id}` }    // /spa/users/1
    })),
    ...postsData.map((post) => ({ 
      params: { slug: `posts/${post.id}` }    // /spa/posts/1
    })),
  ];

  return paths;
}
```

### Client-Only React Component
```tsx
// src/spa/App.tsx:6-12
export const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};
```

### SPA Router Configuration
```tsx
// src/spa/AppRoutes.tsx:8-21
export const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/spa">
          <Route path="" element={<HomePage />} />
          <Route path="posts/:id" element={<PostPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserPage />} />
        </Route>
      </Routes>
    </AppLayout>
  );
};
```

### Data Fetching within SPA
```tsx
// src/spa/pages/HomePage.tsx:18-32
const {
  data: posts,
  isError: isErrorLoadingPosts,
  isFetching: isFetchingPosts,
  isLoading: isLoadingPosts,
} = useQuery({
  queryKey: ["posts"],
  queryFn: async () => {
    const fetchUrl = new URL(`http://localhost:3300/posts`);
    const response = await fetch(fetchUrl.href);
    return response.json() as Promise<IPost[]>;
  },
});
```

## Benefits of This Architecture

**1. Static Performance**
- Landing page loads instantly as static HTML
- Excellent SEO and Core Web Vitals
- No JavaScript needed for content pages

**2. Dynamic Interactivity**
- Full React SPA capabilities within the portal
- Client-side routing and state management
- Rich user interactions and real-time updates

**3. SEO Optimization**
- Static paths generated for known SPA routes
- Search engines can crawl SPA pages
- Better indexing than pure client-side SPAs

**4. Flexible Deployment**
- Static pages can be served from CDN
- SPA portal handles dynamic functionality
- Optimal caching strategies for different content types

## When to Use This Pattern

**Ideal For:**
- Marketing sites with embedded applications
- Documentation sites with interactive demos  
- E-commerce sites with product configurators
- Content sites with user dashboards

**Example Use Cases:**
- Static marketing pages + customer portal
- Documentation + interactive API explorer
- Blog + comment management system
- Landing pages + web application

## Astro Integration Setup

```js
// astro.config.mjs:9-15
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react()] // Enable React integration
});
```

This hybrid approach combines the best of static site generation (Astro) with dynamic single-page application capabilities (React), creating a powerful architecture for modern web applications that need both performance and interactivity.