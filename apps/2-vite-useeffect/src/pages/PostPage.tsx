import { useEffect, useState } from "react";
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
import type { IComment, IPost, IUser } from "../api-types";

export const PostPage = () => {
  const { id: postId } = useParams();

  //post states
  const [post, setPost] = useState<IPost | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isErrorLoadingPosts, setIsErrorLoadingPosts] = useState(false);

  //user states
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isErrorLoadingUser, setIsErrorLoadingUser] = useState(false);

  //comments states
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [isErrorLoadingComments, setIsErrorLoadingComments] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );
  const [isPostingComment, setIsPostingComment] = useState(false);

  //load post
  const fetchPost = async () => {
    setIsLoadingPost(true);
    try {
      const fetchUrl = new URL(`http://localhost:3333/posts/${postId}`);
      const response = await fetch(fetchUrl.href);
      const fetchedPost = (await response.json()) as IPost;
      setPost(fetchedPost);
    } catch (error) {
      console.error(error);
      setIsErrorLoadingPosts(true);
    } finally {
      setIsLoadingPost(false);
    }
  };

  //load user
  const fetchUser = async () => {
    if (!post?.userId) return;
    setIsLoadingUser(true);
    try {
      const fetchUrl = new URL(`http://localhost:3333/users/${post.userId}`);
      const response = await fetch(fetchUrl.href);
      const fetchedUser = (await response.json()) as IUser;
      setUser(fetchedUser);
    } catch (error) {
      console.error(error);
      setIsErrorLoadingUser(true);
    } finally {
      setIsLoadingUser(false);
    }
  };

  //load comments
  const fetchComments = async () => {
    if (!!comments.length) {
      setIsFetchingComments(true);
    } else {
      setIsLoadingComments(true);
    }
    try {
      const fetchUrl = new URL(
        `http://localhost:3333/posts/${postId}/comments`,
      );
      const response = await fetch(fetchUrl.href);
      const fetchedComments = (await response.json()) as IComment[];
      setComments(fetchedComments);
    } catch (error) {
      console.error(error);
      setIsErrorLoadingComments(true);
    } finally {
      setIsLoadingComments(false);
      setIsFetchingComments(false);
    }
  };

  //load post, user, and comments on mount
  useEffect(() => {
    fetchPost();
    fetchUser();
    fetchComments();
  }, []);

  //comment textbox state
  const [commentText, setCommentText] = useState("");

  //delete comment
  const deleteComment = async (commentId: number) => {
    setIsDeletingComment(true);
    setDeletingCommentId(commentId);
    try {
      const deleteUrl = new URL(`http://localhost:3333/comments/${commentId}`);
      await fetch(deleteUrl.href, {
        method: "DELETE",
      });
      // Optimistically update the comments client-side
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeletingComment(false);
      setDeletingCommentId(null);
      fetchComments(); // Refresh comments after deleting
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId);
  };

  //post comment
  const postComment = async (newComment: Omit<IComment, "id">) => {
    setIsPostingComment(true);
    try {
      const postUrl = new URL(`http://localhost:3333/posts/${postId}/comments`);
      const response = await fetch(postUrl.href, {
        method: "POST",
        body: JSON.stringify(newComment),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const postedComment = (await response.json()) as IComment;
      // Optimistically update the comments client-side
      setComments((prev) => [...prev, postedComment]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPostingComment(false);
      fetchComments(); // Refresh comments after posting
    }
  };

  const handleSubmitComment = async () => {
    const newComment: Omit<IComment, "id"> = {
      body: commentText,
      email: "user@mailinator.com",
      name: "User",
      postId: Number(postId),
    };
    await postComment(newComment);
    setCommentText("");
  };

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
        ) : !post || isLoadingPost || isLoadingUser ? (
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
                to={`/users/${user?.id}`}
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
          <ActionIcon variant="subtle" onClick={() => fetchComments()}>
            <IconRefresh />
          </ActionIcon>
        </Tooltip>
      </Flex>
      <Flex w="100%" justify="center" mih="2rem">
        <Collapse in={isFetchingComments}>
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
        ) : isLoadingComments ? (
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
                isDeletingComment && deletingCommentId === comment.id ? 0.5 : 1
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
                  onClick={() => handleDeleteComment(comment.id)}
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
