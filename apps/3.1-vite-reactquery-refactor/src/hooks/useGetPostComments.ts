import { useQuery } from "@tanstack/react-query";
import { IComment } from "../api-types";

const API_URL = "http://localhost:3333";
const ENDPOINT = (postId: string) => `/posts/${postId}/comments`;

export const getPostCommentsQueryKey = (postId: string) => [ENDPOINT(postId)];

export function useGetPostComments(postId: string) {
  return useQuery({
    queryKey: getPostCommentsQueryKey(postId),
    queryFn: async () => {
      const response = await fetch(`${API_URL}${ENDPOINT(postId)}`);
      return response.json() as Promise<IComment[]>;
    },
    refetchInterval: 10000, // 10 seconds
  });
}
