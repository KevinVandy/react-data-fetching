"use client";

import { IComment } from "@/api-types";
import {
  ActionIcon,
  Button,
  Card,
  Loader,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { deleteComment, submitPostComment } from "./actions";
import { useState, useOptimistic, useRef, LegacyRef } from "react";
import { useFormStatus } from "react-dom";

interface CommentSectionProps {
  comments: IComment[];
  postId: number;
}

export default function CommentSection({
  comments,
  postId,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const { pending: isPostingComment } = useFormStatus();

  const formRef = useRef<HTMLFormElement>();

  // wrap our submitPostComment server action with client side optimistic update logic
  async function optimisticallyPostComment(formData: FormData) {
    addOptimisticComment({
      postId,
      id: 0,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      body: formData.get("body") as string,
      sending: true,
    });
    formRef.current?.reset();
    await submitPostComment(formData);
  }

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (currentComments: IComment[], newComment: IComment) => {
      return [...currentComments, newComment];
    },
  );

  return (
    <Stack gap="xl">
      {optimisticComments?.map((comment) => (
        <Card
          opacity={comment.sending ? 0.5 : 1}
          withBorder
          key={comment.id + comment.email}
        >
          {comment.email === "user@mailinator.com" ? (
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
          ) : null}
          <Title order={4}>{comment.name}</Title>
          <Title order={5}>{comment.email}</Title>
          <Text>{comment.body}</Text>
        </Card>
      ))}
      <form
        action={optimisticallyPostComment}
        ref={formRef as LegacyRef<HTMLFormElement>}
      >
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
    </Stack>
  );
}
