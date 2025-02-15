import {
  Alert,
  Anchor,
  Box,
  Card,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { IComment, IPost, IUser } from "../api-types";
import ReactProviders from "./ReactProviders";

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
    <ReactProviders>
      <Stack>
        <Box>
          <Title order={1}>Post: {post?.id}</Title>
          <Title order={2}>{post?.title}</Title>
          <Title order={3}>
            By:{" "}
            <Anchor
              href={`/users/${user?.id}`}
              style={{ textDecoration: "none" }}
            >
              {user?.name}
            </Anchor>
          </Title>
          <Text my="lg">
            {post?.body}. {post?.body}. {post?.body}. {post?.body}. {post?.body}
            .
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
    </ReactProviders>
  );
}
