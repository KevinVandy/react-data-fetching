import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/hello").methods({
  GET: async ({ request }) => {
    return new Response("Hello, World!");
  },
  POST: async ({ request }) => {
    const body = await request.json();
    return new Response(JSON.stringify({ message: `Hello, ${body.name}!` }));
  },
});
