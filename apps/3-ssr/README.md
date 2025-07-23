# Server-Side Rendering (SSR)

Server-Side Rendering means your HTML pages are built on the server for each request, with all the data already included when they reach the browser. Think of it like ordering a custom sandwich - it's made fresh for you right when you order it.

## How it works

1. User requests a page
2. Server fetches all necessary data
3. Server renders complete HTML with content included
4. Fully-formed page is sent to browser
5. JavaScript "hydrates" to add interactivity

## Pros

- **Fast initial load** - Users see content immediately
- **Perfect SEO** - Search engines get complete HTML content
- **Fresh data** - Content is always up-to-date since it's fetched per request
- **Works without JavaScript** - Basic functionality available even if JS fails
- **Good for slow devices** - Less processing required on the client

## Cons

- **Slower navigation** - Each page requires a server round-trip
- **Server complexity** - Need to maintain server infrastructure
- **Higher hosting costs** - Requires actual servers, not just static hosting
- **Potential bottlenecks** - Server can become overwhelmed with requests
- **Slower Time to Interactive** - May show content before it's fully interactive

## Best for

- E-commerce sites (product pages, checkout)
- News and content websites
- Social media platforms
- Apps where fresh data is critical
- Sites that need both SEO and dynamic content

## Not ideal for

- Highly interactive apps (games, complex dashboards)
- Apps with mostly static content (use SSG instead)
- Projects with limited server budget
- Apps where every millisecond of interaction speed matters