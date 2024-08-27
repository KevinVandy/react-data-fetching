import { useQuery } from "@tanstack/react-query";
import { IPost } from "../api-types";

const API_URL = "http://localhost:3333";
const ENDPOINT = (userId: number) => `/posts?userId=${userId}`;

export const getUserPostsQueryKey = (userId: number) => [ENDPOINT(userId)];

export const useGetUserPosts = (userId: number) => {
  return useQuery({
    queryKey: getUserPostsQueryKey(userId),
    queryFn: async () => {
      const fetchUrl = new URL(`${API_URL}${ENDPOINT(userId)}`);
      const response = await fetch(fetchUrl.href);
      return response.json() as Promise<IPost[]>;
    },
  });
};
