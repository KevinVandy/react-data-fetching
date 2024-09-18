import { Box, Flex, Stack, Text, Title } from "@mantine/core";
import { IComment, IPost, IUser } from "../../../api-types";
import Link from "next/link";
import CommentSection from "./CommentSection";

const fetchPostAndComments = async (postId: number) => {
  const [post, comments] = await Promise.all([
    fetch(`http://localhost:3333/posts/${postId}`).then((res) => res.json()),
    fetch(`http://localhost:3333/posts/${postId}/comments`).then((res) =>
      res.json(),
    ),
  ]);
  const user = await fetch(`http://localhost:3333/users/${post.userId}`).then(
    (res) => res.json(),
  );

  return { post, user, comments } as {
    post: IPost;
    user: IUser;
    comments: IComment[];
  };
};

interface PostPageProps {
  params: { id: string };
}

// Server Component
export default async function PostPage({ params }: PostPageProps) {
  const { id: postId } = params;

  const { post, user, comments } = await fetchPostAndComments(+postId);

  return (
    <Stack mb="500px">
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
      {/* Client Component */}
      <CommentSection comments={comments} postId={post.id} />
    </Stack>
  );
}
