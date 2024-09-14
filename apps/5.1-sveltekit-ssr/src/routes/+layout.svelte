<script>
	import '../app.css';
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

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
	<slot></slot>
</QueryClientProvider>
