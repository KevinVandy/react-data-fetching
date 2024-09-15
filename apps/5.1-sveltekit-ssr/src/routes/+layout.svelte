<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import AppLayout from '$lib/components/AppLayout.svelte';

	let SvelteQueryDevtools: any;

	onMount(async () => {
		if (browser && import.meta.env.DEV) {
			const devtoolsModule = await import('@tanstack/svelte-query-devtools');
			SvelteQueryDevtools = devtoolsModule.SvelteQueryDevtools;
		}
	});

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 1000 * 10 // 10 seconds
			}
		}
	});
</script>

<svelte:head>
	<title>SvelteKit SSR (and Svelte Query)</title>
	<meta
		name="viewport"
		content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
	/>
	<link rel="shortcut icon" href="/favicon.svg" />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<AppLayout>
		<slot></slot>
	</AppLayout>
	{#if browser && import.meta.env.DEV && SvelteQueryDevtools}
		<SvelteQueryDevtools />
	{/if}
</QueryClientProvider>
