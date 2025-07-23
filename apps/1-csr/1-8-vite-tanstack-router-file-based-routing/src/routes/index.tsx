import { createFileRoute } from "@tanstack/react-router";
import { Card, Flex, Stack, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQueryOptions } from "../queries/posts";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(postsQueryOptions),
  component: HomePage,
});

function HomePage() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions);

  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
      <Flex wrap="wrap" gap="1rem">
        {posts.map((post) => (
          <Link
            key={post.id}
            to="/posts/$id"
            params={{ id: post.id.toString() }}
            style={{ textDecoration: "none" }}
          >
            <Card
              mih={320}
              shadow="md"
              w={300}
              withBorder
              style={{
                cursor: "pointer",
              }}
            >
              <Title order={3}>{post.title}</Title>
              <Text>{post.body}</Text>
              <Text c="blue" pt="md">
                Go to post
              </Text>
            </Card>
          </Link>
        ))}
      </Flex>
    </Stack>
  );
}
