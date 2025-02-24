import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  addComment: defineAction({
    accept: "form",
    input: z.object({
      postId: z.string(),
      text: z.string(),
    }),
    handler: async ({ postId, text }) => {
      console.log({ postId, text });
      try {
        const newComment = {
          body: text,
          email: "user@mailinator.com",
          name: "User",
          postId: Number(postId),
        };

        const response = await fetch("http://localhost:3300/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment),
        });

        if (!response.ok) {
          throw new Error("Failed to create comment");
        }

        return {
          success: true,
        };
      } catch (error) {
        console.error("Error creating comment:", error);
        return {
          success: false,
          error: "Error creating comment",
        };
      }
    },
  }),

  deleteComment: defineAction({
    accept: "form",
    input: z.object({
      commentId: z.string(),
      postId: z.string(),
    }),
    handler: async ({ commentId }) => {
      try {
        const response = await fetch(
          `http://localhost:3300/comments/${commentId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete comment");
        }

        return {
          success: true,
        };
      } catch (error) {
        console.error("Error deleting comment:", error);
        return {
          success: false,
          error: "Error deleting comment",
        };
      }
    },
  }),
};
