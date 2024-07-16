import { Box, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { IComment, IPost, IUser } from "../../../api-types";
import Link from "next/link";
import CommentForm from "./CommentForm";
import DeleteCommentButton from "./DeleteCommentButton";

const fetchPostAndComments = async (postId: number) => {
  const [post, comments] = await Promise.all([
    fetch(`http://localhost:3333/posts/${postId}`).then((res) => res.json()),
    fetch(`http://localhost:3333/posts/${postId}/comments`).then((res) =>
      res.json()
    ),
  ]);
  const user = await fetch(`http://localhost:3333/users/${post.userId}`).then(
    (res) => res.json()
  );
  console.log({ post, user, comments });
  return { post, user, comments } as {
    post: IPost;
    user: IUser;
    comments: IComment[];
  };
};

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id: postId } = params;

  const { post, user, comments } = await fetchPostAndComments(+postId);

  return (
    <Stack>
      <Box>
        <Title order={1}>Post: {post?.id}</Title>
        <Title order={2}>{post?.title}</Title>
        <Title order={3}>
          By:{" "}
          <Link href={`/users/${user?.id}`} style={{ textDecoration: "none" }}>
            {user?.name}
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
      </Flex>
      <Stack gap="xl">
        {comments?.map((comment) => (
          <Card withBorder key={comment.id + comment.email}>
            <DeleteCommentButton comment={comment} />
            <Title order={4}>{comment.name}</Title>
            <Title order={5}>{comment.email}</Title>
            <Text>{comment.body}</Text>
          </Card>
        ))}
        {/* Client Component */}
        <CommentForm postId={+postId} />
      </Stack>
    </Stack>
  );
}
