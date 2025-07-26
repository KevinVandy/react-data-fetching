import { createServerFn } from "@tanstack/react-start";
import { IUser } from "../api-types";

const API_URL = "http://localhost:3300";

// Server function for getting all users
export const getUsers = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json() as Promise<IUser[]>;
});

// Server function for getting a single user
export const getUser = createServerFn({
  method: "GET",
  response: "data",
})
  .validator((data: number) => data)
  .handler(async (ctx) => {
    const response = await fetch(`${API_URL}/users/${ctx.data}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return response.json() as Promise<IUser>;
  });
