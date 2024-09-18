import { QueryClient, useQuery } from "@tanstack/react-query";
import { IUser } from "../api-types";

const API_URL = "http://localhost:3333";
const ENDPOINT = "/users";

export const getUsersQueryKey = () => [ENDPOINT];

function commonOptions() {
  return {
    queryKey: getUsersQueryKey(),
    queryFn: async () => {
      const response = await fetch(`${API_URL}${ENDPOINT}`);
      return response.json() as Promise<IUser[]>;
    },
  };
}

export function useGetUsers() {
  return useQuery(commonOptions());
}

export function prefetchUsers(queryClient: QueryClient) {
  queryClient.prefetchQuery(commonOptions());
}
