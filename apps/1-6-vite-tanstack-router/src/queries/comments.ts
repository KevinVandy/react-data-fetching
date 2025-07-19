import { queryOptions } from "@tanstack/react-query";
import { IComment } from "../api-types";

const API_URL = "http://localhost:3300";

// Query options for getting post comments
export const postCommentsQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["/posts", postId, "comments"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`);
      return response.json() as Promise<IComment[]>;
    },
    refetchInterval: 10000, // 10 seconds
  });
