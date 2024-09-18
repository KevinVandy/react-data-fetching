import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { IPost } from "../api-types";

const API_URL = "http://localhost:3333";
const ENDPOINT = "/posts";

export const getPostsQueryKey = () => [ENDPOINT];

function commonOptions() {
  return {
    queryKey: getPostsQueryKey(),
    queryFn: async () => {
      const fetchUrl = new URL(`${API_URL}${ENDPOINT}`);
      const response = await fetch(fetchUrl.href);
      return response.json() as Promise<IPost[]>;
    },
  };
}

export function useGetPosts() {
  return useSuspenseQuery(commonOptions());
}

export function prefetchPosts(queryClient: QueryClient) {
  queryClient.prefetchQuery(commonOptions());
}
