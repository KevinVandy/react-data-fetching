"use server";

import { IComment } from "@/api-types";
import { revalidatePath } from "next/cache";

export const deleteComment = async (comment: IComment) => {
  const response = await fetch(`http://localhost:3333/comments/${comment.id}`, {
    method: "DELETE",
  });

  revalidatePath(`/posts/${comment.postId}`);

  return response.json() as Promise<IComment>;
};

export const submitPostComment = async (formData: FormData) => {
  const comment = Object.fromEntries(formData.entries()) as unknown as IComment;

  const response = await fetch(`http://localhost:3333/comments`, {
    method: "POST",
    body: JSON.stringify(comment),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  revalidatePath(`/posts/${comment.postId}`);

  return response.json() as Promise<IComment>;
};
