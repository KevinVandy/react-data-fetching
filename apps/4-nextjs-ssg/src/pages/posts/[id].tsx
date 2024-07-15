import { Alert, Box, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { IComment, IPost, IUser } from "../../api-types";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";

// Generate static paths for all posts
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`http://localhost:3333/posts`);
  const posts = (await response.json()) as IPost[];

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  console.log("Paths: ", paths);

  return {
    paths,
    fallback: true, // Enable fallback for paths not generated at build time
  };
};

// Load post and comments at build time for SSG
export const getStaticProps: GetStaticProps = async (context) => {
  const { id: postId } = context.params!;

  try {
    const [postResponse, commentsResponse] = await Promise.all([
      fetch(`http://localhost:3333/posts/${postId}`),
      fetch(`http://localhost:3333/posts/${postId}/comments`),
    ]);

    const [post, comments] = await Promise.all([
      postResponse.json(),
      commentsResponse.json(),
    ]);

    const userResponse = await fetch(
      `http://localhost:3333/users/${post.userId}`,
    );

    const user = await userResponse.json();

    return {
      props: {
        comments,
        error: false,
        post,
        user,
      },
      revalidate: 10, // Optionally revalidate the data every 10 seconds
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        post: null,
        error: true,
      },
    };
  }
};

interface IPostPageProps {
  comments: IComment[];
  error: boolean;
  post: IPost;
  user: IUser;
}

export default function PostPage({
  comments,
  error: pageError,
  post,
  user,
}: IPostPageProps) {
  if (pageError) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red">
        There was an error loading this post
      </Alert>
    );
  }

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
          {post?.body}. {post?.body}. {post?.body}. {post?.body}. {post?.body}.
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
            <Title order={4}>{comment.name}</Title>
            <Title order={5}>{comment.email}</Title>
            <Text>{comment.body}</Text>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
