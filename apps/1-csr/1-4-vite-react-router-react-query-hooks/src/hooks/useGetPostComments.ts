import { useQuery } from "@tanstack/react-query";
import { IComment } from "../api-types";

const API_URL = "http://localhost:3300";
const ENDPOINT = (postId: string) => `/posts/${postId}/comments`;

export const getPostCommentsQueryKey = (postId: string) => [ENDPOINT(postId)];

export function useGetPostComments(postId: string) {
  return useQuery({
    queryKey: getPostCommentsQueryKey(postId),
    queryFn: async () => {
      const response = await fetch(`${API_URL}${ENDPOINT(postId)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      return response.json() as Promise<IComment[]>;
    },
    refetchInterval: 10000, // 10 seconds
  });
}
