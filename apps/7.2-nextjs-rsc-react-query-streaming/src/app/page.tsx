import { IPost } from "@/api-types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { PostsFeed } from "./PostsFeed";
export const fetchPosts = async () => {
  const fetchUrl = new URL(`http://localhost:3333/posts`);
  const response = await fetch(fetchUrl.href);
  const fetchedPosts = (await response.json()) as IPost[];
  return fetchedPosts;
};

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsFeed />
    </HydrationBoundary>
  );
}
