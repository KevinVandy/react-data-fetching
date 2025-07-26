import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { IComment } from "../api-types";

const API_URL = "http://localhost:3300";

// Zod schemas for validation
const PostIdSchema = z.string().transform((val) => parseInt(val, 10));

const CreateCommentSchema = z.object({
  postId: z.number(),
  name: z.string(),
  email: z.email(),
  body: z.string(),
});

const CommentIdSchema = z.number();

// Server function for getting post comments
export const getPostComments = createServerFn({
  method: "GET",
  response: "data",
})
  .validator((data: unknown) => {
    return PostIdSchema.parse(data);
  })
  .handler(async (ctx) => {
    const response = await fetch(`${API_URL}/posts/${ctx.data}/comments`);
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    return response.json() as Promise<IComment[]>;
  });

// Server function for creating a new comment
export const createComment = createServerFn({
  method: "POST",
  response: "data",
})
  .validator((data: unknown) => {
    return CreateCommentSchema.parse(data);
  })
  .handler(async (ctx) => {
    const response = await fetch(`${API_URL}/comments`, {
      method: "POST",
      body: JSON.stringify(ctx.data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to create comment");
    }
    return response.json() as Promise<IComment>;
  });

// Server function for deleting a comment
export const deleteComment = createServerFn({
  method: "POST",
  response: "data",
})
  .validator((data: unknown) => {
    return CommentIdSchema.parse(data);
  })
  .handler(async (ctx) => {
    const response = await fetch(`${API_URL}/comments/${ctx.data}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }
    return response.json() as Promise<IComment>;
  });
