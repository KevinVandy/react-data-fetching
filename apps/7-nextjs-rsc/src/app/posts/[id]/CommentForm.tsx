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
import { submitPostComment } from "./actions";
import { useFormStatus } from "react-dom";

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [commentText, setCommentText] = useState("");

  const { pending: isPostingComment } = useFormStatus();

  return (
    <form action={submitPostComment}>
      <Stack gap="md">
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="email" value="user@mailinator.com" />
        <input type="hidden" name="name" value="User" />
        <Textarea
          value={commentText}
          onChange={(event) => setCommentText(event.currentTarget.value)}
          name="body"
          disabled={isPostingComment}
          label="Post a Comment"
        />
        <Button
          type="submit"
          leftSection={
            isPostingComment ? (
              <Loader variant="oval" color="white" size="xs" />
            ) : null
          }
        >
          Post Comment
        </Button>
      </Stack>
    </form>
  );
}
