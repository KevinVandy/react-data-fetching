import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Collapse,
  Flex,
  Loader,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconRefresh, IconTrash } from "@tabler/icons-react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { IComment } from "../api-types";
import { postQueryOptions } from "../queries/posts";
import { postCommentsQueryOptions } from "../queries/comments";
import { userQueryOptions } from "../queries/users";
import { getPost } from "../server-functions/posts";
import { getUser } from "../server-functions/users";
import {
  getPostComments,
  createComment,
  deleteComment,
} from "../server-functions/comments";

export const Route = createFileRoute("/posts/$id")({
  loader: async ({ context: { queryClient }, params: { id } }) => {
    // First load the post using server function
    const post = await getPost({ data: id });
    queryClient.setQueryData(postQueryOptions(id).queryKey, post);

    // Then load user and comments in parallel using server functions
    const [user, comments] = await Promise.all([
      getUser({ data: post.userId }),
      getPostComments({ data: id }),
    ]);

    // Set the data in the query client
    queryClient.setQueryData(userQueryOptions(post.userId).queryKey, user);
    queryClient.setQueryData(postCommentsQueryOptions(id).queryKey, comments);
  },
  component: PostPage,
});

function PostPage() {
  const queryClient = useQueryClient();
  const { id: postId } = useParams({ from: "/posts/$id" });

  // All data is already loaded by the route loader, so these will resolve immediately
  const { data: post } = useSuspenseQuery(postQueryOptions(postId));
  const { data: user } = useSuspenseQuery(userQueryOptions(post.userId));
  const {
    data: comments,
    isFetching: isFetchingComments,
    refetch: refetchComments,
  } = useSuspenseQuery(postCommentsQueryOptions(postId));

  //delete comment, refresh comments after delete
  const {
    mutate: deleteCommentMutation,
    isPending: isDeletingComment,
    context: deletingCommentContext,
  } = useMutation({
    mutationFn: (commentId: number) => deleteComment({ data: commentId }),
    //record which comment is being deleted so we can give it lower opacity
    onMutate: async (commentId) => ({ commentId }),
    onError: (err, commentId) => {
      console.error(
        `Error deleting comment ${commentId}. Rolling UI back`,
        err,
      );
      alert("Error deleting comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: postCommentsQueryOptions(postId).queryKey,
      }); //refresh comments
    },
  });

  // Post new comment - with optimistic updates!
  const [commentText, setCommentText] = useState("");

  const { mutate: postComment, isPending: isPostingComment } = useMutation({
    mutationFn: (comment: Omit<IComment, "id">) =>
      createComment({ data: comment }),
    //optimistic client-side update
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({
        queryKey: postCommentsQueryOptions(postId).queryKey,
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData([
        "comments",
        newComment.postId.toString(),
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        postCommentsQueryOptions(postId).queryKey,
        (oldComments: any) => [...oldComments, newComment],
      );

      // Return a context object with the snapshot value
      return { previousComments };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, _newComment, context) => {
      queryClient.setQueryData(
        postCommentsQueryOptions(postId).queryKey,
        context?.previousComments as IComment[],
      );
      console.error("Error posting comment. Rolling UI back", err);
    },
    onSuccess: () => {
      setCommentText(""); //clear comment text
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: postCommentsQueryOptions(postId).queryKey,
      });
    },
  });

  const handleSubmitComment = useCallback(async () => {
    const newComment: Omit<IComment, "id"> = {
      body: commentText,
      email: "user@mailinator.com",
      name: "User",
      postId: Number(postId),
    };
    postComment(newComment);
  }, [commentText, postId, postComment]);

  return (
    <Stack>
      <Box>
        <Title order={1}>Post: {post.id}</Title>
        <Title order={2}>{post.title}</Title>
        <Title order={3}>
          By:{" "}
          <Link
            to="/users/$id"
            params={{ id: user.id.toString() }}
            style={{ textDecoration: "none" }}
          >
            {user.name}
          </Link>
        </Title>
        <Text my="lg">
          {post.body}. {post.body}. {post.body}. {post.body}. {post.body}.
        </Text>
      </Box>
      <Flex justify="space-between" align="center">
        <Title mt="lg" order={3}>
          Comments on this Post
        </Title>
        <Tooltip withArrow label="Refresh Comments">
          <ActionIcon variant="subtle" onClick={() => refetchComments()}>
            <IconRefresh />
          </ActionIcon>
        </Tooltip>
      </Flex>
      <Flex w="100%" justify="center" mih="2rem">
        <Collapse in={isFetchingComments || isDeletingComment}>
          <Loader />
        </Collapse>
      </Flex>
      <Stack gap="xl">
        {comments.map((comment) => (
          <Card
            withBorder
            opacity={
              isDeletingComment &&
              deletingCommentContext?.commentId === comment.id
                ? 0.5
                : 1
            }
            key={comment.id + comment.email}
          >
            {comment.email === "user@mailinator.com" && (
              <ActionIcon
                color="red"
                pos="absolute"
                right={10}
                top={10}
                variant="subtle"
                onClick={() => deleteCommentMutation(comment.id)}
              >
                <IconTrash />
              </ActionIcon>
            )}

            <Title order={4}>{comment.name}</Title>
            <Title order={5}>{comment.email}</Title>
            <Text>{comment.body}</Text>
          </Card>
        ))}
        <Textarea
          disabled={isPostingComment}
          label="Post a Comment"
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmitComment();
            }
          }}
          value={commentText}
        />
        <Button
          disabled={isPostingComment || commentText.length === 0}
          leftSection={
            isPostingComment ? (
              <Loader variant="oval" color="white" size="xs" />
            ) : null
          }
          onClick={handleSubmitComment}
        >
          Post Comment
        </Button>
      </Stack>
    </Stack>
  );
}
