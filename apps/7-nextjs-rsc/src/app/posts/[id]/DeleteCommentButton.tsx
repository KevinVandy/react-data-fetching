"use client";

import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { IComment } from "../../../api-types";
import { deleteComment } from "./actions";

interface DeleteCommentButtonProps {
  comment: IComment;
}

export default function DeleteCommentButton({
  comment,
}: DeleteCommentButtonProps) {
  return comment.email === "user@mailinator.com" ? (
    <ActionIcon
      color="red"
      pos="absolute"
      right={10}
      top={10}
      variant="subtle"
      onClick={() => deleteComment(comment)}
    >
      <IconTrash />
    </ActionIcon>
  ) : null;
}
