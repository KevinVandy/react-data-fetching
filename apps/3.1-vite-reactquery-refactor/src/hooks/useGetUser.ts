import { useQuery } from "@tanstack/react-query";
import { IUser } from "../api-types";

const API_URL = "http://localhost:3333";
const ENDPOINT = (userId: number) => `/users/${userId}`;

export const getUserQueryKey = (userId: number) => [ENDPOINT(userId)];

export function useGetUser(userId?: number) {
  return useQuery({
    queryKey: getUserQueryKey(userId!),
    queryFn: async () => {
      const response = await fetch(`${API_URL}${ENDPOINT(userId!)}`);
      return response.json() as Promise<IUser>;
    },
    enabled: !!userId,
  });
}
