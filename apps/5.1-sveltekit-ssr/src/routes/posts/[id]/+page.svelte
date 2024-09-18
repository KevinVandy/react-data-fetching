<script lang="ts">
	import { Alert, Button, Card, Textarea } from 'flowbite-svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import type { IPost, IComment, IUser } from '$lib/api-types';

	export let data: PageData;
	let { initialPost, initialComments, error: pageError } = data;

	const queryClient = useQueryClient();
	let postId = initialPost?.id;
	let commentText = '';

	const postQuery = createQuery({
		queryKey: [`/posts/${postId}`],
		queryFn: async () => {
			const response = await fetch(`http://localhost:3333/posts/${postId}`);
			return response.json() as Promise<IPost>;
		},
		initialData: initialPost
	});

	const userQuery = createQuery({
		queryKey: [`/users/${$postQuery.data?.userId}`],
		queryFn: async () => {
			const response = await fetch(`http://localhost:3333/users/${$postQuery.data?.userId}`);
			return response.json() as Promise<IUser>;
		},
		enabled: !!$postQuery.data?.userId
	});

	const commentsQuery = createQuery({
		queryKey: [`/posts/${postId}/comments`],
		queryFn: async () => {
			const response = await fetch(`http://localhost:3333/posts/${postId}/comments`);
			return response.json() as Promise<IComment[]>;
		},
		initialData: initialComments,
		refetchInterval: 10000
	});

	const deleteCommentMutation = createMutation({
		mutationFn: async (commentId: number) => {
			const response = await fetch(`http://localhost:3333/comments/${commentId}`, {
				method: 'DELETE'
			});
			return response.json() as Promise<IComment>;
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [`/posts/${postId}/comments`] });
		}
	});

	const postCommentMutation = createMutation({
		mutationFn: async (comment: Omit<IComment, 'id'>) => {
			const response = await fetch(`http://localhost:3333/comments`, {
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
			queryClient.setQueryData([`/posts/${postId}/comments`], (oldComments: any) => [
				...oldComments,
				newComment
			]);
			return { previousComments };
		},
		onError: (err, _newComment, context) => {
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

	function handleDeleteComment(commentId: number) {
		$deleteCommentMutation.mutate(commentId);
	}

	function handleSubmitComment() {
		if (!commentText || !postId) return;
		const newComment: Omit<IComment, 'id'> = {
			body: commentText,
			email: 'user@mailinator.com',
			name: 'User',
			postId: postId
		};
		$postCommentMutation.mutate(newComment);
	}
</script>

<div class="p-8">
	{#if pageError}
		<Alert color="red">
			<span class="font-medium">Bummer!</span>
			There was an error loading this post
		</Alert>
	{:else if $postQuery.isLoading || $userQuery.isLoading}
		<div class="animate-pulse">
			<div class="mb-4 h-4 w-1/2 rounded-full bg-gray-200"></div>
			<div class="mb-4 h-8 w-full rounded-full bg-gray-200"></div>
		</div>
	{:else if $postQuery.isError || $userQuery.isError}
		<Alert color="red">
			<span class="font-medium">Bummer!</span>
			There was an error loading this post
		</Alert>
	{:else if $postQuery.data}
		<h1 class="mb-2 text-3xl font-bold">Post: {$postQuery.data.id}</h1>
		<h2 class="mb-2 text-2xl font-semibold">{$postQuery.data.title}</h2>
		<h3 class="mb-4 text-xl">
			By:
			{#if $userQuery.isLoading}
				<span class="animate-pulse">Loading...</span>
			{:else if $userQuery.isError}
				<span class="text-red-500">Error loading user</span>
			{:else}
				<a href="/users/{$userQuery.data?.id}" class="text-blue-600 hover:underline"
					>{$userQuery.data?.name}</a
				>
			{/if}
		</h3>
		<p class="mb-8">{$postQuery.data.body}</p>

		<h3 class="mb-4 text-xl font-semibold">Comments on this Post</h3>

		<div class="mb-8 w-full space-y-4">
			{#if $commentsQuery.isLoading}
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

		<Textarea
			bind:value={commentText}
			label="Post a Comment"
			rows={4}
			class="mb-4"
			disabled={$postCommentMutation.isPending}
		/>
		<Button
			on:click={handleSubmitComment}
			disabled={$postCommentMutation.isPending || commentText.length === 0}
		>
			{#if $postCommentMutation.isPending}
				<svg class="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			{/if}
			Post Comment
		</Button>
	{/if}
</div>
