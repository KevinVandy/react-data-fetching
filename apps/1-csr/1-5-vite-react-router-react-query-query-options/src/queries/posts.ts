import { queryOptions } from "@tanstack/react-query";
import { IPost } from "../api-types";

const API_URL = "http://localhost:3300";

// Query options for getting all posts
export const postsQueryOptions = queryOptions({
  queryKey: ["/posts"],
  queryFn: async () => {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return response.json() as Promise<IPost[]>;
  },
});

// Query options for getting a single post
export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["/posts", postId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/posts/${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      return response.json() as Promise<IPost>;
    },
  });

// Query options for getting user posts
export const userPostsQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ["/posts", { userId }],
    queryFn: async () => {
      const fetchUrl = new URL(`${API_URL}/posts?userId=${userId}`);
      const response = await fetch(fetchUrl.href);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return response.json() as Promise<IPost[]>;
    },
  });
