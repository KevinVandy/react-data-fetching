# Next.js Static Site Generation (SSG)

This example demonstrates Next.js's Static Site Generation capabilities, where pages are pre-rendered at build time using `getStaticProps` and `getStaticPaths` for optimal performance and SEO.

## Key Learning Points

- **getStaticProps**: Fetch data at build time and pass to page component as props
- **getStaticPaths**: Generate dynamic routes statically at build time  
- **Static HTML Generation**: Pages are pre-rendered as HTML files
- **Build-Time Data Fetching**: Data is fetched once during build, not at runtime
- **Incremental Static Regeneration (ISR)**: Pages can be regenerated with `revalidate`
- **Optimal Performance**: Static files served directly from CDN

## Code Examples

### Static Props for Homepage
```tsx
// pages/index.tsx:7-30
export const getStaticProps: GetStaticProps = async () => {
  try {
    const fetchUrl = new URL(`http://localhost:3300/posts`);
    const response = await fetch(fetchUrl.href);
    const fetchedPosts = (await response.json()) as IPost[];

    return {
      props: {
        posts: fetchedPosts,
        error: false,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        posts: [],
        error: true,
      },
      revalidate: 10, // ISR: revalidate every 10 seconds
    };
  }
};
```

### Dynamic Route Generation
```tsx
// pages/posts/[id].tsx:8-22
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`http://localhost:3300/posts`);
  const posts = (await response.json()) as IPost[];

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: true, // Enable fallback for paths not generated at build time
  };
};
```

### Static Props for Dynamic Pages
```tsx
// pages/posts/[id].tsx:25-64
export const getStaticProps: GetStaticProps = async (context) => {
  const { id: postId } = context.params!;

  try {
    // Parallel fetching of post and comments
    const [postResponse, commentsResponse] = await Promise.all([
      fetch(`http://localhost:3300/posts/${postId}`),
      fetch(`http://localhost:3300/posts/${postId}/comments`),
    ]);

    const [post, comments] = await Promise.all([
      postResponse.json(),
      commentsResponse.json(),
    ]);

    // Sequential fetch for user (depends on post data)
    const userResponse = await fetch(`http://localhost:3300/users/${post.userId}`);
    const user = await userResponse.json();

    return {
      props: {
        comments,
        error: false,
        post,
        user,
      },
      revalidate: 10, // ISR: revalidate every 10 seconds
    };
  } catch (error) {
    return {
      props: {
        post: null,
        error: true,
      },
    };
  }
};
```

### Component Receiving Static Props
```tsx
// pages/index.tsx:37-68
export default function HomePage({ posts, error }: HomePageProps) {
  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
      <Flex gap="md" wrap="wrap">
        {posts?.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
            <Card mih={320} shadow="md" w={300} withBorder style={{ cursor: "pointer" }}>
              <Title order={3}>{post.title}</Title>
              <Text>{post.body}</Text>
              <Text c="blue" pt="md">Go to post</Text>
            </Card>
          </Link>
        ))}
      </Flex>
    </Stack>
  );
}
```

## Benefits of SSG

**1. Performance**
- Pages served as static HTML files
- Minimal JavaScript hydration required
- Fast loading times from CDN

**2. SEO Optimization**
- Complete HTML content available for crawlers
- Meta tags and structured data pre-rendered
- Better search engine rankings

**3. Scalability**
- Static files can be cached indefinitely
- No server-side processing per request
- Cost-effective hosting

**4. Reliability**
- No database or API dependencies at runtime
- Pages remain available even if data sources fail
- High availability through CDN distribution

## Incremental Static Regeneration (ISR)

ISR allows you to update static pages after build time:

```tsx
return {
  props: { posts },
  revalidate: 10, // Regenerate page every 10 seconds if there's a request
};
```

**How ISR Works:**
1. Initial request serves cached static page
2. After revalidate time, next request triggers regeneration
3. New page is generated in background
4. Updated page replaces old cached version

## When to Use SSG

**Perfect For:**
- Blogs and content sites
- E-commerce product pages
- Documentation sites
- Marketing pages

**Requirements:**
- Data available at build time
- Content doesn't change frequently
- Same content for all users

This approach provides the best performance and SEO while maintaining the developer experience of a React application.