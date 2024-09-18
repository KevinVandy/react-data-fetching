import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Loader, Stack, Title } from "@mantine/core";
import { IPost } from "@/api-types";
import { PostsFeed } from "./PostsFeed";
import { Suspense } from "react";

export const fetchPosts = async () => {
  console.log("fetching posts");
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
      <Stack>
        <Title order={2}>Your Home Feed</Title>
        <Suspense fallback={<Loader />}>
          <PostsFeed />
        </Suspense>
      </Stack>
    </HydrationBoundary>
  );
}
