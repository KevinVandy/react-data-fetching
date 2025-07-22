import { queryOptions } from "@tanstack/react-query";
import { getPosts, getPost, getUserPosts } from "../server-functions/posts";

// Query options for getting all posts
export const postsQueryOptions = queryOptions({
  queryKey: ["/posts"],
  queryFn: () => getPosts(),
});

// Query options for getting a single post
export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["/posts", postId],
    queryFn: () => getPost({ data: postId }),
  });

// Query options for getting user posts
export const userPostsQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ["/posts", { userId }],
    queryFn: () => getUserPosts({ data: userId }),
  });
