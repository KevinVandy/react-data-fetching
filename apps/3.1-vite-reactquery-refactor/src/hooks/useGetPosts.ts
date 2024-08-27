import { useQuery } from "@tanstack/react-query";
import { IPost } from "../api-types";

const API_URL = "http://localhost:3333";
const ENDPOINT = "/posts";

export const getPostsQueryKey = () => [ENDPOINT];

export function useGetPosts() {
  return useQuery({
    queryKey: getPostsQueryKey(),
    queryFn: async () => {
      const fetchUrl = new URL(`${API_URL}${ENDPOINT}`);
      const response = await fetch(fetchUrl.href);
      return response.json() as Promise<IPost[]>;
    },
  });
}
