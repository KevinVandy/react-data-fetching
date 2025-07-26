import { createServerFn } from "@tanstack/react-start";
import { IPost } from "../api-types";

const API_URL = "http://localhost:3300";

// Server function for getting all posts
export const getPosts = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json() as Promise<IPost[]>;
});

// Server function for getting a single post
export const getPost = createServerFn({
  method: "GET",
  response: "data",
})
  .validator((data: string) => data)
  .handler(async (ctx) => {
    const response = await fetch(`${API_URL}/posts/${ctx.data}`);
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    return response.json() as Promise<IPost>;
  });

// Server function for getting user posts
export const getUserPosts = createServerFn({
  method: "GET",
  response: "data",
})
  .validator((data: number) => data)
  .handler(async (ctx) => {
    const fetchUrl = new URL(`${API_URL}/posts?userId=${ctx.data}`);
    const response = await fetch(fetchUrl.href);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return response.json() as Promise<IPost[]>;
  });
