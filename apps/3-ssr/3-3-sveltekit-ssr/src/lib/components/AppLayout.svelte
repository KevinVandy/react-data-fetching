<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { HomeOutline, UsersGroupOutline } from 'flowbite-svelte-icons';

	const links = [
		{ icon: HomeOutline, color: 'text-blue-500', label: 'Home Feed', href: '/' },
		{ icon: UsersGroupOutline, color: 'text-teal-500', label: 'Users', href: '/users' }
	];
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			SvelteKit SSR (and Svelte Query)
		</span>
	</NavBrand>
	<NavHamburger on:click={toggle} />
	<NavUl {hidden}>
		{#each links as link}
			<NavLi href={link.href}>
				<svelte:component this={link.icon} class="{link.color} mr-2 h-4 w-4" />
				{link.label}
			</NavLi>
		{/each}
	</NavUl>
</Navbar>

<main class="container mx-auto mb-96 mt-4 px-4">
	<slot></slot>
</main>
