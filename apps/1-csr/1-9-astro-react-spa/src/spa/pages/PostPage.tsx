import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Collapse,
  Flex,
  Loader,
  Skeleton,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconAlertCircle, IconRefresh, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type IComment, type IPost, type IUser } from "../api-types";

export const PostPage = () => {
  const queryClient = useQueryClient();
  const { id: postId } = useParams();

  //load post
  const {
    data: post,
    isPending: isPendingPost,
    isError: isErrorLoadingPosts,
  } = useQuery({
    queryKey: ["posts", postId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3300/posts/${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      return response.json() as Promise<IPost>;
    },
  });

  //load user - depends on user id from post
  const {
    data: user,
    isPending: isPendingUser,
    isError: isErrorLoadingUser,
  } = useQuery({
    enabled: !!post?.userId,
    queryKey: ["users", post?.userId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3300/users/${post?.userId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json() as Promise<IUser>;
    },
  });

  //load comments
  const {
    data: comments,
    isPending: isPendingComments,
    isFetching: isFetchingComments,
    isError: isErrorLoadingComments,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3300/posts/${postId}/comments`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      return response.json() as Promise<IComment[]>;
    },
    refetchInterval: 10000, // 10 seconds
  });

  //delete comment, refresh comments after delete
  const {
    mutate: deleteComment,
    isPending: isDeletingComment,
    context: deletingCommentContext,
  } = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetch(
        `http://localhost:3300/comments/${commentId}`,
        {
          method: "DELETE",
        },
      );
      return response.json() as Promise<IComment>;
    },
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
        queryKey: ["posts", postId, "comments"],
      }); //refresh comments
    },
  });

  // Post new comment - with optimistic updates!
  const [commentText, setCommentText] = useState("");

  const { mutate: postComment, isPending: isPostingComment } = useMutation({
    mutationFn: async (comment: Omit<IComment, "id">) => {
      const response = await fetch(`http://localhost:3300/comments`, {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      return response.json() as Promise<IComment>;
    },
    //optimistic client-side update
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({
        queryKey: ["posts", postId, "comments"],
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData([
        "posts",
        postId,
        "comments",
        newComment.postId.toString(),
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["posts", postId, "comments"],
        (oldComments: any) => [...oldComments, newComment],
      );

      // Return a context object with the snapshot value
      return { previousComments };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, _newComment, context) => {
      queryClient.setQueryData(
        ["posts", postId, "comments"],
        context?.previousComments,
      );
      console.error("Error posting comment. Rolling UI back", err);
    },
    onSuccess: () => {
      setCommentText(""); //clear comment text
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "comments"],
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
        {isErrorLoadingPosts || isErrorLoadingUser ? (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Bummer!"
            color="red"
          >
            There was an error loading this post
          </Alert>
        ) : !post || isPendingPost || isPendingUser ? (
          <>
            <Skeleton animate height="20px" width="50%" mb="md" />
            <Skeleton animate height="40px" width="100%" mb="md" />
          </>
        ) : (
          <>
            <Title order={1}>Post: {post?.id}</Title>
            <Title order={2}>{post?.title}</Title>
            <Title order={3}>
              By:{" "}
              <Link
                to={`/spa/users/${user?.id}`}
                style={{ textDecoration: "none" }}
              >
                {user?.name}
              </Link>
            </Title>
            <Text my="lg">
              {post.body}. {post.body}. {post.body}. {post.body}. {post.body}.
            </Text>
          </>
        )}
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
        {isErrorLoadingComments ? (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Bummer!"
            color="red"
          >
            There was an error loading comments for this post
          </Alert>
        ) : isPendingComments ? (
          [...Array(5)].map((_, index) => (
            <Card withBorder key={index}>
              <Skeleton animate height="20px" width="25%" mb="md" />
              <Skeleton animate height="15px" width="33%" mb="md" />
              <Skeleton animate height="40px" width="100%" mb="md" />
            </Card>
          ))
        ) : (
          comments?.map((comment) => (
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
                  onClick={() => deleteComment(comment.id)}
                >
                  <IconTrash />
                </ActionIcon>
              )}

              <Title order={4}>{comment.name}</Title>
              <Title order={5}>{comment.email}</Title>
              <Text>{comment.body}</Text>
            </Card>
          ))
        )}
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
};
