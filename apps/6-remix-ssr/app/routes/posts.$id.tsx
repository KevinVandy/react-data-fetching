import { useCallback, useEffect, useState } from "react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const loader: LoaderFunction = async ({ params }) => {
  const { id: postId } = params;

  try {
    const [postResponse, commentsResponse] = await Promise.all([
      fetch(`http://localhost:3333/posts/${postId}`),
      fetch(`http://localhost:3333/posts/${postId}/comments`),
    ]);

    const [initialPost, initialComments] = await Promise.all([
      postResponse.json(),
      commentsResponse.json(),
    ]);

    return json({
      initialPost,
      initialComments,
      error: false,
    });
  } catch (error) {
    console.error(error);

    return json({
      initialPost: null,
      initialComments: null,
      error: true,
    });
  }
};

//post comment endpoint
export const action: ActionFunction = async ({ request }) => {
  const returnData = { data: {}, errors: {}, success: false };

  const data = Object.fromEntries(await request.formData()) as unknown as Omit<
    IComment,
    "id"
  >;

  try {
    const response = await fetch(`http://localhost:3333/comments`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    returnData.data = await response.json();
    returnData.success = true;
  } catch (error) {
    console.error(error);
    returnData.errors = {
      comment: "Error posting comment",
    };
  }
  return json(returnData);
};

interface IPostPageProps {
  initialPost: IPost;
  initialComments: IComment[];
  error: boolean;
}

export const meta: MetaFunction = () => {
  return [{ title: "Remix SSR (and React Query)" }];
};

export default function PostPage() {
  const {
    initialPost,
    initialComments,
    error: pageError,
  } = useLoaderData<IPostPageProps>();

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    refetchComments(); //refresh comments after posting
    if (actionData?.success) {
      setCommentText(""); //clear comment field
    }
  }, [actionData]);

  const navigation = useNavigation();
  const isPostingComment = navigation.state === "submitting";

  const { id: postId } = useParams();

  const queryClient = useQueryClient();

  // Load post - with initial data from SSR
  const {
    data: post,
    isLoading: isLoadingPost,
    isError: isErrorLoadingPosts,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/posts/${postId}`);
      return response.json() as Promise<IPost>;
    },
    initialData: initialPost, // SSR, with refresh
  });

  // Load comments - with initial data from SSR
  const {
    data: comments,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
    isError: isErrorLoadingComments,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/posts/${postId}/comments`,
      );
      return response.json() as Promise<IComment[]>;
    },
    initialData: initialComments, // SSR, with refresh
    refetchInterval: 10000, // 10 seconds
  });

  //load user - depends on user id from post so client-side only
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorLoadingUser,
  } = useQuery({
    enabled: !!post?.userId,
    queryKey: ["user", post?.userId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/users/${post?.userId}`,
      );
      return response.json() as Promise<IUser>;
    },
  });

  //delete comment, refresh comments after delete
  const {
    mutate: deleteComment,
    isPending: isDeletingComment,
    context: deletingCommentContext,
  } = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetch(
        `http://localhost:3333/comments/${commentId}`,
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
      queryClient.invalidateQueries({ queryKey: ["comments"] }); //refresh comments
    },
  });

  const handleDeleteComment = useCallback(
    (commentId: number) => {
      deleteComment(commentId);
    },
    [deleteComment],
  );

  // Post new comment - with optimistic updates!
  const [commentText, setCommentText] = useState("");

  if (pageError) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red">
        There was an error loading this page
      </Alert>
    );
  }

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
        <Form method="post">
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="email" value="user@mailinator.com" />
          <input type="hidden" name="name" value="User" />
          <Stack gap="md">
            <Textarea
              name="body"
              disabled={isPostingComment}
              label="Post a Comment"
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText}
            />
            <Button
              type="submit"
              disabled={isPostingComment || commentText.length === 0}
              leftSection={
                isPostingComment ? (
                  <Loader variant="oval" color="white" size="xs" />
                ) : null
              }
            >
              Post Comment
            </Button>
          </Stack>
        </Form>
      </Stack>
    </Stack>
  );
}
