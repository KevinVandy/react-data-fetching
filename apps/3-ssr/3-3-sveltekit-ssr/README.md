# SvelteKit Server-Side Rendering (SSR)

This example demonstrates SvelteKit's server-side rendering capabilities using load functions for server-side data fetching, combined with TanStack Svelte Query for client-side state management, showing how Svelte's reactive approach handles SSR + hydration patterns.

## Key Learning Points

- **SvelteKit Load Functions**: Server-side data fetching with `+page.server.ts` load functions
- **Svelte Reactive Patterns**: Using reactive statements and stores for data management
- **TanStack Svelte Query**: Svelte-specific implementation of TanStack Query
- **SSR + Client Hydration**: Initial server data enhanced with client-side reactivity
- **Svelte Component Model**: Template-first approach with script blocks
- **Progressive Enhancement**: Svelte's built-in approach to enhancing server-rendered content

## Code Examples

### Server Load Function for Homepage

```typescript
// src/routes/+page.server.ts:4-21
export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const fetchUrl = new URL(`http://localhost:3300/posts`);
		const response = await fetch(fetchUrl.href);
		const fetchedPosts = (await response.json()) as IPost[];

		return {
			posts: fetchedPosts,
			error: false
		};
	} catch (error) {
		console.error(error);
		return {
			posts: [],
			error: true
		};
	}
};
```

### Dynamic Route Server Load Function

```typescript
// src/routes/posts/[id]/+page.server.ts:4-32
export const load: PageServerLoad = async ({ params, fetch }) => {
	const { id: postId } = params;

	try {
		// Parallel data fetching on server
		const [postResponse, commentsResponse] = await Promise.all([
			fetch(`http://localhost:3300/posts/${postId}`),
			fetch(`http://localhost:3300/posts/${postId}/comments`)
		]);

		const [initialPost, initialComments] = await Promise.all([
			postResponse.json() as Promise<IPost>,
			commentsResponse.json() as Promise<IComment[]>
		]);

		return {
			initialPost,
			initialComments,
			error: false
		};
	} catch (error) {
		console.error(error);
		return {
			initialPost: null,
			initialComments: [],
			error: true
		};
	}
};
```

### Svelte Component with Server Data

```svelte
<!-- src/routes/+page.svelte:1-29 -->
<script lang="ts">
	import { Alert, Card } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { posts, error } = data;
</script>

<div class="p-8">
	<h2 class="mb-4 text-2xl font-bold">Your Home Feed</h2>
	<div class="flex flex-wrap gap-4">
		{#if error}
			<Alert color="red">
				<span class="font-medium">Bummer!</span>
				There was an error fetching posts
			</Alert>
		{:else}
			{#each posts as post (post.id)}
				<a href="/posts/{post.id}" class="no-underline">
					<Card class="h-80 w-72 cursor-pointer">
						<h3 class="mb-2 text-xl font-bold">{post.title}</h3>
						<p class="mb-4">{post.body}</p>
						<p class="mt-auto text-blue-600">Go to post</p>
					</Card>
				</a>
			{/each}
		{/if}
	</div>
</div>
```

### TanStack Svelte Query Integration

```svelte
<!-- src/routes/posts/[id]/+page.svelte:14-40 -->
<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	export let data: PageData;
	let { initialPost, initialComments, error: pageError } = data;

	const postQuery = createQuery({
		queryKey: [`/posts/${postId}`],
		queryFn: async () => {
			const response = await fetch(`http://localhost:3300/posts/${postId}`);
			return response.json() as Promise<IPost>;
		},
		initialData: initialPost // Server data as initial state
	});

	const commentsQuery = createQuery({
		queryKey: [`/posts/${postId}/comments`],
		queryFn: async () => {
			const response = await fetch(`http://localhost:3300/posts/${postId}/comments`);
			return response.json() as Promise<IComment[]>;
		},
		initialData: initialComments, // Server data as initial state
		refetchInterval: 10000 // Client-side polling
	});
</script>
```

### Optimistic Updates with Mutations

```svelte
<!-- src/routes/posts/[id]/+page.svelte:54-84 -->
<script lang="ts">
	const postCommentMutation = createMutation({
		mutationFn: async (comment: Omit<IComment, 'id'>) => {
			const response = await fetch(`http://localhost:3300/comments`, {
				method: 'POST',
				body: JSON.stringify(comment),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			});
			return response.json() as Promise<IComment>;
		},
		onMutate: async (newComment) => {
			await queryClient.cancelQueries({ queryKey: [`/posts/${postId}/comments`] });
			const previousComments = queryClient.getQueryData([`/posts/${postId}/comments`]);
			// Optimistic update
			queryClient.setQueryData([`/posts/${postId}/comments`], (oldComments: any) => [
				...oldComments,
				newComment
			]);
			return { previousComments };
		},
		onError: (err, _newComment, context) => {
			// Rollback on error
			queryClient.setQueryData([`/posts/${postId}/comments`], context?.previousComments);
			console.error('Error posting comment. Rolling UI back', err);
		},
		onSuccess: () => {
			commentText = '';
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [`/posts/${postId}/comments`] });
		}
	});
</script>
```

### Reactive Template Syntax

```svelte
<!-- src/routes/posts/[id]/+page.svelte:137-169 -->
<div class="mb-8 w-full space-y-4">
	{#if $commentsQuery.isPending}
		<div class="animate-pulse">
			<div class="mb-4 h-4 w-1/2 rounded-full bg-gray-200"></div>
			<div class="mb-4 h-8 w-full rounded-full bg-gray-200"></div>
		</div>
	{:else if $commentsQuery.isError}
		<Alert color="red">
			<span class="font-medium">Bummer!</span>
			There was an error loading comments
		</Alert>
	{:else}
		{#each $commentsQuery.data as comment (comment.id)}
			<Card class="w-full" padding="none" size="xl">
				<div class="flex w-full items-start justify-between p-4">
					<div>
						<h4 class="font-semibold">{comment.name}</h4>
						<h5 class="text-sm text-gray-600">{comment.email}</h5>
					</div>
					{#if comment.email === 'user@mailinator.com'}
						<button
							class="text-red-500 hover:text-red-700"
							on:click={() => handleDeleteComment(comment.id)}
						>
							Delete
						</button>
					{/if}
				</div>
				<p class="mt-2 px-4 pb-4">{comment.body}</p>
			</Card>
		{/each}
	{/if}
</div>
```

## Benefits of SvelteKit SSR

**1. Svelte's Reactive Paradigm**

- Compile-time optimizations eliminate virtual DOM overhead
- Reactive variables automatically update dependent components
- Smaller bundle sizes compared to other frameworks
- Built-in state management without external libraries

**2. Developer Experience**

- Template-first approach with intuitive syntax
- Automatic TypeScript integration with `+page.server.ts`
- Built-in CSS scoping and preprocessing
- Excellent developer tools and hot reload

**3. Performance Advantages**

- Server-side rendering with minimal client-side JavaScript
- Compile-time optimizations reduce runtime overhead
- Progressive enhancement by default
- Efficient hydration with selective component mounting

**4. Full-Stack Integration**

- Load functions provide type-safe data fetching
- Seamless server/client data flow
- Built-in form handling and validation
- Adapter system for various deployment targets

## SvelteKit vs Other SSR Frameworks

**vs React Router v7 (3-2):**

- Smaller bundle sizes due to compilation approach
- More intuitive template syntax vs JSX
- Built-in CSS solutions vs external styling
- Compile-time optimizations vs runtime virtual DOM

**vs Next.js SSR (3-1):**

- Reactive paradigm vs component lifecycle management
- Template-first approach vs JSX syntax
- Built-in state management vs external libraries
- Smaller production bundles

**vs Traditional Server Rendering:**

- Modern reactive patterns with server data
- Progressive enhancement with interactive islands
- Type-safe data contracts between server and client
- Modern development experience with hot reload

## Svelte-Specific Patterns

**1. Reactive Statements**

- `$:` prefix creates reactive computations
- Automatic dependency tracking
- Efficient updates only when dependencies change

**2. Store Integration**

- TanStack Svelte Query stores work seamlessly
- `$store` syntax for automatic subscriptions
- No manual subscription/unsubscription needed

**3. Template Logic**

- `{#if}`, `{#each}`, `{#await}` blocks
- Built-in conditional rendering and iteration
- Intuitive event handling with `on:click`

## When to Use SvelteKit SSR

**Perfect For:**

- Performance-critical applications
- Projects requiring smaller bundle sizes
- Teams preferring template-first development
- Applications with complex reactive state
- Modern full-stack web applications

**Requirements:**

- Team comfortable with Svelte paradigms
- Performance and bundle size priorities
- Need for server-side rendering
- Modern browser support (no legacy IE)

SvelteKit provides an excellent balance of modern development experience, performance, and maintainability with its unique compilation approach to reactivity.
