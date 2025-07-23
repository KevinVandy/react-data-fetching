# Astro + React Static Site Generation (SSG)

This example demonstrates how to combine Astro's static site generation with React components, showing how data fetched at build time in Astro can be passed as props to React components for enhanced interactivity while maintaining optimal performance.

## Key Learning Points

- **Astro + React Integration**: Using React components within Astro pages
- **Props Passing**: Passing server-fetched data from Astro to React components
- **Selective Hydration**: React components are hydrated only when needed
- **Build-Time Data + Runtime Interactivity**: Server data with client-side functionality
- **Component Islands**: Interactive React islands within static Astro pages
- **Best of Both Worlds**: Static generation performance + React component ecosystem

## Code Examples

### Astro Page with React Component Integration

```astro
---
// src/pages/index.astro:2-16
import Layout from "../layouts/Layout.astro";
import HomePage from "../components/HomePage";
import type { IPost } from "../api-types";

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

<Layout title="Welcome to Astro.">
  <main>
    <HomePage posts={posts} error={error} client:load />
  </main>
</Layout>
```

### React Component Receiving Server Data

```tsx
// src/components/HomePage.tsx:5-30
interface HomePageProps {
  posts: IPost[];
  error: boolean;
}

export default function HomePage({ posts, error }: HomePageProps) {
  return (
    <AppLayout>
      <Stack>
        <Title order={2}>Your Home Feed</Title>
        <Flex gap="md" wrap="wrap">
          {posts?.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                mih={320}
                shadow="md"
                w={300}
                withBorder
                style={{ cursor: "pointer" }}
              >
                <Title order={3}>{post.title}</Title>
                <Text>{post.body}</Text>
                <Text c="blue" pt="md">
                  Go to post
                </Text>
              </Card>
            </Link>
          ))}
        </Flex>
      </Stack>
    </AppLayout>
  );
}
```

### Dynamic Route with React Component

```astro
---
// src/pages/posts/[id].astro:5-39
export async function getStaticPaths() {
  const response = await fetch(`http://localhost:3300/posts`);
  const posts = (await response.json()) as IPost[];

  return posts.map((post) => ({
    params: { id: post.id.toString() },
  }));
}

const { id } = Astro.params;

let post: IPost;
let comments: IComment[];
let user: IUser;

try {
  const [postResponse, commentsResponse] = await Promise.all([
    fetch(`http://localhost:3300/posts/${id}`),
    fetch(`http://localhost:3300/posts/${id}/comments`),
  ]);

  [post, comments] = await Promise.all([
    postResponse.json(),
    commentsResponse.json(),
  ]);

  const userResponse = await fetch(`http://localhost:3300/users/${post.userId}`);
  user = await userResponse.json();
} catch (error) {
  return Astro.redirect("/error");
}
---

<Layout title={`Post ${id}`}>
  <main>
    <PostPage post={post} user={user} comments={comments} client:load />
  </main>
</Layout>
```

### React Component with Props from Server

```tsx
// src/components/PostPage.tsx:8-45
interface PostPageProps {
  post: IPost;
  user: IUser;
  comments: IComment[];
}

export default function PostPage({ post, user, comments }: PostPageProps) {
  return (
    <AppLayout>
      <Stack>
        <Box>
          <Title order={1}>Post: {post.id}</Title>
          <Title order={2}>{post.title}</Title>
          <Title order={3}>
            By:{" "}
            <Link href={`/users/${user.id}`} style={{ textDecoration: "none" }}>
              {user.name}
            </Link>
          </Title>
          <Text my="lg">{post.body}</Text>
        </Box>

        <Title mt="lg" order={3}>
          Comments on this Post
        </Title>
        <Stack gap="xl">
          {comments.map((comment) => (
            <Card withBorder key={comment.id}>
              <Title order={4}>{comment.name}</Title>
              <Title order={5}>{comment.email}</Title>
              <Text>{comment.body}</Text>
            </Card>
          ))}
        </Stack>
      </Stack>
    </AppLayout>
  );
}
```

## Hydration Directives

Astro provides several client directives for controlling when React components hydrate:

```astro
<!-- Load immediately on page load -->
<HomePage posts={posts} client:load />

<!-- Load when component becomes visible -->
<PostPage post={post} client:visible />

<!-- Load when component is idle -->
<CommentSection comments={comments} client:idle />

<!-- Never hydrate - static only -->
<StaticComponent data={data} />
```

## Benefits of Astro + React SSG

**1. Performance + Interactivity**

- Static HTML generation for fast initial loads
- React components hydrated only when needed
- Selective interactivity without full SPA overhead

**2. Developer Experience**

- Use familiar React component patterns
- Server data easily passed as props
- Rich component ecosystem available

**3. SEO Optimization**

- All content server-rendered at build time
- Fast loading times improve rankings
- Complete HTML for search crawlers

**4. Flexible Architecture**

- Mix static content with interactive components
- Choose hydration strategy per component
- Gradual enhancement approach

## Comparison with Other Approaches

**vs Pure Astro (2-2):**

- More interactivity with React components
- Familiar React development patterns
- Larger bundle size (but still minimal)

**vs Next.js SSG (2-1):**

- Better performance (selective hydration)
- More control over JavaScript loading
- Less mature ecosystem than Next.js

**vs Pure React SPA (1-x):**

- Better SEO and initial load performance
- Reduced JavaScript bundle size
- Data pre-fetched at build time

## When to Use Astro + React SSG

**Perfect For:**

- Content sites that need some interactivity
- Marketing sites with interactive demos
- Blogs with comment systems
- Portfolio sites with contact forms
- E-commerce with product filters

**Requirements:**

- Need React component ecosystem
- Want selective hydration control
- Data available at build time
- Performance is critical

This approach provides an excellent balance between static site performance and modern React development experience.
