import { queryOptions } from "@tanstack/react-query";
import { getUsers, getUser } from "../server-functions/users";

// Query options for getting all users
export const usersQueryOptions = queryOptions({
  queryKey: ["/users"],
  queryFn: () => getUsers(),
});

// Query options for getting a single user
export const userQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ["/users", userId],
    queryFn: () => getUser({ data: userId }),
  });
