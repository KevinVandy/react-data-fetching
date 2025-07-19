import { queryOptions } from "@tanstack/react-query";
import { IUser } from "../api-types";

const API_URL = "http://localhost:3300";

// Query options for getting all users
export const usersQueryOptions = queryOptions({
  queryKey: ["/users"],
  queryFn: async () => {
    const response = await fetch(`${API_URL}/users`);
    return response.json() as Promise<IUser[]>;
  },
});

// Query options for getting a single user
export const userQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ["/users", userId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/users/${userId}`);
      return response.json() as Promise<IUser>;
    },
  });
