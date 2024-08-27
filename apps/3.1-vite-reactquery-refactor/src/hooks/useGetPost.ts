import { useQuery } from "@tanstack/react-query";
import { IPost } from "../api-types";

const API_URL = "http://localhost:3333";
const ENDPOINT = (postId: string) => `/posts/${postId}`;

export const getPostQueryKey = (postId: string) => [ENDPOINT(postId)];

export function useGetPost(postId: string) {
  return useQuery({
    queryKey: getPostQueryKey(postId),
    queryFn: async () => {
      const response = await fetch(`${API_URL}${ENDPOINT(postId)}`);
      return response.json() as Promise<IPost>;
    },
  });
}
