# Class Component Data Fetching with componentDidMount

This example demonstrates legacy React data fetching patterns using class components and the `componentDidMount` lifecycle method.

## Key Learning Points

- **Class Components**: Uses React class components instead of functional components
- **componentDidMount**: Fetches data when component mounts using the componentDidMount lifecycle
- **componentDidUpdate**: Refetches data when route parameters change
- **Manual State Management**: Uses this.setState() for managing loading, error, and data states
- **Fetch API**: Direct usage of browser fetch() API without abstractions
- **Manual Loading States**: Explicit handling of loading, error, and success states

## Code Examples

### Basic Data Fetching in componentDidMount

```tsx
// HomePage.tsx:53-55
componentDidMount() {
  this.fetchPosts();
}

// HomePage.tsx:32-51
fetchPosts = async () => {
  const { posts } = this.state;

  if (!posts.length) {
    this.setState({ isLoadingPosts: true });
  }
  this.setState({ isFetchingPosts: true });

  try {
    const fetchUrl = new URL(`http://localhost:3300/posts`);
    const response = await fetch(fetchUrl.href);
    const fetchedPosts = (await response.json()) as IPost[];
    this.setState({ posts: fetchedPosts });
  } catch (error) {
    console.error(error);
    this.setState({ isErrorLoadingPosts: true });
  } finally {
    this.setState({ isLoadingPosts: false, isFetchingPosts: false });
  }
};
```

### Refetching on Route Parameter Changes

```tsx
// PostPage.tsx:83-89
componentDidUpdate(prevProps: PostPageProps) {
  if (prevProps.params.id !== this.props.params.id) {
    this.fetchPost();
    this.fetchUser();
    this.fetchComments();
  }
}
```

### Manual State Management Pattern

```tsx
// PostPage.tsx:17-42
interface HomePageState {
  posts: IPost[];
  isLoadingPosts: boolean;
  isErrorLoadingPosts: boolean;
  isFetchingPosts: boolean;
}

state: HomePageState = {
  posts: [],
  isLoadingPosts: false,
  isErrorLoadingPosts: false,
  isFetchingPosts: false,
};
```
