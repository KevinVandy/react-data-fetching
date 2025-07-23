# Next.js Server-Side Rendering (SSR)

This example demonstrates Next.js's Server-Side Rendering capabilities using `getServerSideProps`, where pages are rendered on the server for each request with fresh data, providing personalized content and up-to-date information.

## Key Learning Points

- **getServerSideProps**: Fetch data on the server for each request
- **Server-Side Rendering**: Pages rendered on server with fresh data
- **Dynamic Data**: Content can be personalized or frequently updated
- **Request Context**: Access to request, response, query parameters
- **No Build-Time Generation**: Pages rendered at request time, not build time
- **Real-Time Data**: Always shows current data from APIs/database

## Code Examples

### Server-Side Props for Homepage

```tsx
// pages/index.tsx:7-29
export const getServerSideProps: GetServerSideProps = async (context) => {
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
    };
  }
};
```

### Dynamic Route Server-Side Rendering

```tsx
// pages/posts/[id].tsx:8-45
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id: postId } = context.params!;

  try {
    // Parallel data fetching on the server
    const [postResponse, commentsResponse] = await Promise.all([
      fetch(`http://localhost:3300/posts/${postId}`),
      fetch(`http://localhost:3300/posts/${postId}/comments`),
    ]);

    const [post, comments] = await Promise.all([
      postResponse.json(),
      commentsResponse.json(),
    ]);

    // Sequential fetch for user data
    const userResponse = await fetch(
      `http://localhost:3300/users/${post.userId}`,
    );
    const user = await userResponse.json();

    return {
      props: {
        comments,
        error: false,
        post,
        user,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        post: null,
        error: true,
      },
    };
  }
};
```

### Component Receiving Server Data

```tsx
// pages/index.tsx:31-62
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

### Request Context Access

```tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, params, query } = context;

  // Access cookies, headers, user session
  const userAgent = req.headers["user-agent"];
  const cookies = req.headers.cookie;

  // Redirect based on conditions
  if (!userIsAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: { data } };
};
```

## Benefits of SSR

**1. Fresh Data**

- Always shows current data from APIs/database
- Perfect for user-specific or frequently changing content
- No stale data issues

**2. SEO with Dynamic Content**

- Search engines see fully rendered HTML
- Dynamic meta tags and content
- Good for personalized or time-sensitive pages

**3. Personalization**

- User-specific content rendered on server
- Access to cookies, headers, and session data
- Secure data fetching with server-side credentials

**4. Security**

- API keys and sensitive data stay on server
- No exposure of internal APIs to client
- Server-side authentication and authorization

## SSR vs SSG Comparison

**SSR Advantages:**

- Real-time data (always fresh)
- User personalization
- Access to request context
- No build-time data requirements

**SSR Disadvantages:**

- Slower response times (server processing)
- Higher server load and costs
- No CDN caching benefits
- More complex deployment

**SSG Advantages:**

- Faster loading (static files)
- Lower server costs
- Excellent CDN caching
- High scalability

**SSG Disadvantages:**

- Data can be stale
- No personalization
- Build-time data requirements
- No request context

## When to Use SSR

**Perfect For:**

- User dashboards and accounts
- E-commerce cart/checkout pages
- Social media feeds
- Admin panels
- Real-time data applications
- Content that changes frequently

**Avoid SSR When:**

- Content is mostly static
- Performance is critical
- High traffic with cacheable content
- Build-time data is sufficient

## Performance Considerations

**Optimize SSR Performance:**

- Use parallel data fetching with Promise.all
- Implement proper caching strategies
- Consider hybrid approach (SSR + client-side updates)
- Use ISR when appropriate
- Optimize database queries
- Consider API response caching

This approach provides real-time data and personalization at the cost of longer response times and higher server load.
