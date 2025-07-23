# Introduction to TanStack Router

This example demonstrates migrating from React Router to TanStack Router, showing the benefits of 100% type-safe routing with better developer experience and more powerful navigation patterns.

## Why TanStack Router?

Based on the [TanStack Router overview](https://tanstack.com/router/latest/docs/framework/react/overview), TanStack Router offers several advantages over React Router:

- **100% Type Safety**: Complete TypeScript inference across all routes, parameters, and navigation
- **Advanced Search Parameter Management**: Treats search params as a powerful state manager with JSON serialization
- **Built-in Data Loading**: Lightweight caching layer with flexible data lifecycle APIs  
- **Flexible Architecture**: Supports both file-based and code-based routing patterns
- **Future-Ready**: Designed to be upgradable to a full-stack framework

## Key Learning Points

- **Type-Safe Navigation**: Fully typed route paths and parameters with IntelliSense
- **Code-Based Route Definition**: Programmatic route creation with `createRoute`
- **Type-Safe Parameters**: Typed route parameters with `useParams`
- **Router Context**: Shared context (like QueryClient) across all routes
- **Type Registration**: Module augmentation for complete type safety
- **Outlet Pattern**: Similar to React Router but with better type inference

## Code Examples

### Type-Safe Navigation with Parameters
```tsx
// pages/HomePage.tsx:53-57
<Link
  to="/posts/$id"
  params={{ id: post.id.toString() }}
  style={{ textDecoration: "none" }}
>
```

### Type-Safe Parameter Access
```tsx
// pages/PostPage.tsx:28
const { id: postId } = useParams({ from: "/posts/$id" });
```

### Code-Based Route Definition
```tsx
// AppRoutes.tsx:43-47
const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$id",
  component: PostPage,
});
```

### Router Context Configuration
```tsx
// AppRoutes.tsx:58-69
export const createAppRouter = (queryClient: QueryClient) => {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent", // Preload on hover/focus
    scrollRestoration: true,
    context: {
      queryClient, // Shared context across routes
    },
  });
  
  return router;
};
```

### Type Registration for Full Type Safety
```tsx
// AppRoutes.tsx:72-76
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
```

### Nested Route Tree Structure
```tsx
// AppRoutes.tsx:49-55
const routeTree = rootRoute.addChildren([
  indexRoute,
  usersRoute,
  userRoute,
  postRoute,
]);
```

## Benefits Compared to React Router

**Type Safety**: Every route, parameter, and navigation is fully typed
```tsx
// TanStack Router - Fully typed
<Link to="/posts/$id" params={{ id: "123" }} />

// React Router - String-based, error-prone
<Link to={`/posts/${id}`} />
```

**Better Parameter Handling**: Type-safe parameter extraction
```tsx
// TanStack Router - Typed parameters
const { id } = useParams({ from: "/posts/$id" });

// React Router - Untyped, could be undefined
const { id } = useParams();
```

**IntelliSense Support**: Auto-completion for all routes and parameters

**Future-Proof**: Designed for scalability and framework evolution

This example maintains the same data fetching patterns as the previous example (queryOptions) while upgrading the routing layer to provide better type safety and developer experience.