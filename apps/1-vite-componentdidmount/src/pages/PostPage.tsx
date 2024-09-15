import React, { Component } from "react";
import { Link } from "react-router-dom";
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
import withRouter from "../withRouter";

interface MatchParams {
  id: string;
}

interface State {
  post: IPost | null;
  isLoadingPost: boolean;
  isErrorLoadingPosts: boolean;
  user: IUser | null;
  isLoadingUser: boolean;
  isErrorLoadingUser: boolean;
  comments: IComment[];
  isLoadingComments: boolean;
  isFetchingComments: boolean;
  isErrorLoadingComments: boolean;
  isDeletingComment: boolean;
  deletingCommentId: number | null;
  isPostingComment: boolean;
  commentText: string;
}

interface PostPageProps {
  location: {
    pathname: string;
    search: string;
    hash: string;
    state: null;
    key: string;
  };
  params: MatchParams;
  navigate: any;
}

class PostPage extends Component<PostPageProps, State> {
  constructor(props: PostPageProps) {
    super(props);
    this.state = {
      post: null,
      isLoadingPost: false,
      isErrorLoadingPosts: false,
      user: null,
      isLoadingUser: false,
      isErrorLoadingUser: false,
      comments: [],
      isLoadingComments: false,
      isFetchingComments: false,
      isErrorLoadingComments: false,
      isDeletingComment: false,
      deletingCommentId: null,
      isPostingComment: false,
      commentText: "",
    };
  }

  componentDidMount() {
    this.fetchPost();
    this.fetchUser();
    this.fetchComments();
  }

  componentDidUpdate(prevProps: PostPageProps) {
    if (prevProps.params.id !== this.props.params.id) {
      this.fetchPost();
      this.fetchUser();
      this.fetchComments();
    }
  }

  fetchPost = async () => {
    const { id: postId } = this.props.params;
    this.setState({ isLoadingPost: true });
    try {
      const fetchUrl = new URL(`http://localhost:3333/posts/${postId}`);
      const response = await fetch(fetchUrl.href);
      const fetchedPost = (await response.json()) as IPost;
      this.setState({ post: fetchedPost });
    } catch (error) {
      console.error(error);
      this.setState({ isErrorLoadingPosts: true });
    } finally {
      this.setState({ isLoadingPost: false });
    }
  };

  fetchUser = async () => {
    const { post } = this.state;
    if (!post?.userId) return;
    this.setState({ isLoadingUser: true });
    try {
      const fetchUrl = new URL(`http://localhost:3333/users/${post.userId}`);
      const response = await fetch(fetchUrl.href);
      const fetchedUser = (await response.json()) as IUser;
      this.setState({ user: fetchedUser });
    } catch (error) {
      console.error(error);
      this.setState({ isErrorLoadingUser: true });
    } finally {
      this.setState({ isLoadingUser: false });
    }
  };

  fetchComments = async () => {
    const { id: postId } = this.props.params;
    const { comments } = this.state;
    if (!!comments.length) {
      this.setState({ isFetchingComments: true });
    } else {
      this.setState({ isLoadingComments: true });
    }
    try {
      const fetchUrl = new URL(
        `http://localhost:3333/posts/${postId}/comments`,
      );
      const response = await fetch(fetchUrl.href);
      const fetchedComments = (await response.json()) as IComment[];
      this.setState({ comments: fetchedComments });
    } catch (error) {
      console.error(error);
      this.setState({ isErrorLoadingComments: true });
    } finally {
      this.setState({ isLoadingComments: false, isFetchingComments: false });
    }
  };

  deleteComment = async (commentId: number) => {
    this.setState({ isDeletingComment: true, deletingCommentId: commentId });
    try {
      const deleteUrl = new URL(`http://localhost:3333/comments/${commentId}`);
      await fetch(deleteUrl.href, {
        method: "DELETE",
      });
      this.setState((prevState) => ({
        comments: prevState.comments.filter(
          (comment) => comment.id !== commentId,
        ),
      }));
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isDeletingComment: false, deletingCommentId: null });
      this.fetchComments(); // Refresh comments after deleting
    }
  };

  handleDeleteComment = async (commentId: number) => {
    await this.deleteComment(commentId);
  };

  postComment = async (newComment: Omit<IComment, "id">) => {
    const { id: postId } = this.props.params;
    this.setState({ isPostingComment: true });
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
      this.setState((prevState) => ({
        comments: [...prevState.comments, postedComment],
      }));
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isPostingComment: false });
      this.fetchComments(); // Refresh comments after posting
    }
  };

  handleSubmitComment = async () => {
    const { commentText } = this.state;
    const { id: postId } = this.props.params;
    const newComment: Omit<IComment, "id"> = {
      body: commentText,
      email: "user@mailinator.com",
      name: "User",
      postId: Number(postId),
    };
    await this.postComment(newComment);
    this.setState({ commentText: "" });
  };

  handleCommentTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ commentText: e.target.value });
  };

  render() {
    const {
      post,
      isLoadingPost,
      isErrorLoadingPosts,
      user,
      isLoadingUser,
      isErrorLoadingUser,
      comments,
      isLoadingComments,
      isFetchingComments,
      isErrorLoadingComments,
      isDeletingComment,
      deletingCommentId,
      isPostingComment,
      commentText,
    } = this.state;

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
            <ActionIcon variant="subtle" onClick={this.fetchComments}>
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
                  isDeletingComment && deletingCommentId === comment.id
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
                    onClick={() => this.handleDeleteComment(comment.id)}
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
            onChange={this.handleCommentTextChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                this.handleSubmitComment();
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
            onClick={this.handleSubmitComment}
          >
            Post Comment
          </Button>
        </Stack>
      </Stack>
    );
  }
}

export default withRouter(PostPage);
