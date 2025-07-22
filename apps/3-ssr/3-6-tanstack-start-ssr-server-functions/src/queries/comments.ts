import { queryOptions } from "@tanstack/react-query";
import { getPostComments } from "../server-functions/comments";

// Query options for getting post comments
export const postCommentsQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["/posts", postId, "comments"],
    queryFn: () => getPostComments({ data: postId }),
    refetchInterval: 10000, // 10 seconds
  });
