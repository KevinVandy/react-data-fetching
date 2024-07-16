"use client";

import { use, useActionState, useCallback, useState } from "react";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Loader,
  Stack,
  Textarea,
} from "@mantine/core";
import { IconAlertCircle, IconRefresh, IconTrash } from "@tabler/icons-react";
import { IComment, IPost, IUser } from "../../../api-types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { deleteComment, submitPostComment } from "./actions";
import { useFormStatus } from "react-dom";

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
