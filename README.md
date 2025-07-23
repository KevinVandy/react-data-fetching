# React Data Fetching

This repository demonstrates the four main data-fetching strategies in modern React applications: Client-Side Rendering (CSR), Static Site Generation (SSG), Server-Side Rendering (SSR), and Streaming with React Server Components. Each approach is implemented across multiple frameworks to show real-world patterns and trade-offs.

- [0-json-server](./apps/0-json-server) - backend server for the apps - `pnpm serve`

## Table of Contents

## Client-Side Rendering (CSR/SPAs)

- [1-1-vite-react-router-componentdidmount](./apps/1-spa/1-1-vite-react-router-componentdidmount) - `pnpm dev1-1` [http://localhost:3311/](http://localhost:3311/)
- [1-2-vite-react-router-useeffect](./apps/1-spa/1-2-vite-react-router-useeffect) - `pnpm dev1-2` [http://localhost:3312/](http://localhost:3312/)
- [1-3-vite-react-router-react-query](./apps/1-spa/1-3-vite-react-router-react-query) - `pnpm dev1-3` [http://localhost:3313/](http://localhost:3313/)
- [1-4-vite-react-router-react-query-hooks](./apps/1-spa/1-4-vite-react-router-react-query-hooks) - `pnpm dev1-4` [http://localhost:3314/](http://localhost:3314/)
- [1-5-vite-react-router-react-query-query-options](./apps/1-spa/1-5-vite-react-router-react-query-query-options) - `pnpm dev1-5` [http://localhost:3315/](http://localhost:3315/)
- [1-6-vite-tanstack-router](./apps/1-spa/1-6-vite-tanstack-router) - `pnpm dev1-6` [http://localhost:3316/](http://localhost:3316/)
- [1-7-vite-tanstack-router-loaders](./apps/1-spa/1-7-vite-tanstack-router-loaders) - `pnpm dev1-7` [http://localhost:3317/](http://localhost:3317/)
- [1-8-vite-tanstack-router-file-based-routing](./apps/1-spa/1-8-vite-tanstack-router-file-based-routing) - `pnpm dev1-8` [http://localhost:3318/](http://localhost:3318/)
- [1-9-astro-react-spa](./apps/1-spa/1-9-astro-react-spa) - `pnpm dev1-9` [http://localhost:3319/](http://localhost:3319/)

## Static Site Generation (SSG)

- [2-1-nextjs-ssg](./apps/2-ssg/2-1-nextjs-ssg) - `pnpm dev2-1` [http://localhost:3321/](http://localhost:3321/)
- [2-2-astro-ssg](./apps/2-ssg/2-2-astro-ssg) - `pnpm dev2-2` [http://localhost:3322/](http://localhost:3322/)
- [2-3-astro-react-ssg](./apps/2-ssg/2-3-astro-react-ssg) - `pnpm dev2-3` [http://localhost:3323/](http://localhost:3323/)

## Server-Side Rendering (SSR)

- [3-1-nextjs-ssr](./apps/3-ssr/3-1-nextjs-ssr) - `pnpm dev3-1` [http://localhost:3331/](http://localhost:3331/)
- [3-2-react-router-ssr](./apps/3-ssr/3-2-react-router-ssr) - `pnpm dev3-2` [http://localhost:3332/](http://localhost:3332/)
- [3-3-sveltekit-ssr](./apps/3-ssr/3-3-sveltekit-ssr) - `pnpm dev3-3` [http://localhost:3333/](http://localhost:3333/)
- [3-4-astro-ssr](./apps/3-ssr/3-4-astro-ssr) - `pnpm dev3-4` [http://localhost:3334/](http://localhost:3334/)
- [3-5-tanstack-start-ssr](./apps/3-ssr/3-5-tanstack-start-ssr) - `pnpm dev3-5` [http://localhost:3335/](http://localhost:3335/)
- [3-6-tanstack-start-ssr-server-functions](./apps/3-ssr/3-6-tanstack-start-ssr-server-functions) - `pnpm dev3-6` [http://localhost:3336/](http://localhost:3336/)

## HTML Streaming (RSC / Astro Server Islands)

- [4-1-nextjs-rsc](./apps/4-streaming/4-1-nextjs-rsc) - `pnpm dev4-1` [http://localhost:3341/](http://localhost:3341/)
- [4-2-nextjs-rsc-react-query](./apps/4-streaming/4-2-nextjs-rsc-react-query) - `pnpm dev4-2` [http://localhost:3342/](http://localhost:3342/)
- [4-3-nextjs-rsc-react-query-streaming](./apps/4-streaming/4-3-nextjs-rsc-react-query-streaming) - `pnpm dev4-3` [http://localhost:3343/](http://localhost:3343/)
- [4-4-astro-server-islands](./apps/4-streaming/4-4-astro-server-islands) - `pnpm dev4-4` [http://localhost:3344/](http://localhost:3344/)

## Understanding Data-Fetching Strategies

Each directory contains a README explaining the core concepts, pros and cons, and use cases:

- **[apps/1-csr/](./apps/1-csr/)** - Client-Side Rendering: JavaScript fetches data in the browser
- **[apps/2-ssg/](./apps/2-ssg/)** - Static Site Generation: Pages built at build time with data pre-fetched
- **[apps/3-ssr/](./apps/3-ssr/)** - Server-Side Rendering: HTML generated on server per request
- **[apps/4-streaming/](./apps/4-streaming/)** - Streaming: Progressive page delivery with React Server Components

## Frameworks Covered

This repository explores data fetching across multiple meta-frameworks and libraries:

- **React Router** - Client-side and server-side routing
- **Next.js** - Full-stack React framework with SSG, SSR, and RSC
- **Astro** - Multi-framework static site generator with server rendering
- **TanStack Router** - Type-safe routing with built-in data loading
- **TanStack Start** - Full-stack React framework built on TanStack Router
- **SvelteKit** - _bonus_ Full-stack Svelte framework for comparison

## Getting Started

1. Install dependencies: `pnpm install`
2. Start the backend: `pnpm serve` (runs json-server on port 3000)
3. Run any example app using the commands listed above
4. Each app fetches data from the same API to demonstrate different approaches

The examples progress from basic patterns to more advanced implementations, showing how each strategy evolves with different tools and frameworks. **TanStack Query (React Query)** is heavily featured throughout, demonstrating how this powerful data-fetching library integrates with various meta-frameworks - from pure client-side apps to server-rendered applications with hydration, and even alongside React Server Components for optimal user experiences.
