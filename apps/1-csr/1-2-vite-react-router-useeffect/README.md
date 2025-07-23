# Functional Component Data Fetching with useEffect

This example demonstrates the native React hooks approach to data fetching using functional components and the `useEffect` hook instead of class components.

> **Note**: While this shows the built-in hooks way to fetch data, there are often better approaches. See [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) for more guidance on when to use effects vs other patterns.

## Key Learning Points

- **Functional Components**: Uses modern React functional components with hooks
- **useEffect Hook**: Fetches data when component mounts using useEffect with empty dependency array
- **useState Hook**: Manages component state with individual useState hooks for each piece of state
- **Manual State Management**: Explicit handling of loading, error, and data states with separate state variables
- **Fetch API**: Direct usage of browser fetch() API without abstractions
- **useParams Hook**: Uses React Router's useParams to access route parameters

## Code Examples

### Basic Data Fetching with useEffect
```tsx
// HomePage.tsx:45-47
useEffect(() => {
  fetchPosts();
}, []);

// HomePage.tsx:25-42
const fetchPosts = async () => {
  if (!posts.length) {
    setIsLoadingPosts(true);
  }
  setIsFetchingPosts(true);
  try {
    const fetchUrl = new URL(`http://localhost:3300/posts`);
    const response = await fetch(fetchUrl.href);
    const fetchedPosts = (await response.json()) as IPost[];
    setPosts(fetchedPosts);
  } catch (error) {
    console.error(error);
    setIsErrorLoadingPosts(true);
  } finally {
    setIsLoadingPosts(false);
    setIsFetchingPosts(false);
  }
};
```

### useState for State Management
```tsx
// HomePage.tsx:18-22
const [posts, setPosts] = useState<IPost[]>([]);
const [isLoadingPosts, setIsLoadingPosts] = useState(false);
const [isErrorLoadingPosts, setIsErrorLoadingPosts] = useState(false);
const [isFetchingPosts, setIsFetchingPosts] = useState(false);
```

### Using useParams for Route Parameters
```tsx
// PostPage.tsx:23
const { id: postId } = useParams();

// PostPage.tsx:103-107
useEffect(() => {
  fetchPost();
  fetchUser();
  fetchComments();
}, []);
```

### Problem: Missing Dependency Arrays
Notice this example has a potential issue - the useEffect calls functions that depend on `postId` but doesn't include dependencies, which could cause stale closure problems when route parameters change.