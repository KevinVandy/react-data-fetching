import { Anchor, Card, Title, Text, Stack, Flex } from "@mantine/core";
import type { IPost } from "../api-types";
import ReactProviders from "./ReactProviders";

interface HomePageProps {
  posts: IPost[];
  error: boolean;
}

export function HomePage({ posts, error }: HomePageProps) {
  return (
    <ReactProviders>
      <Stack>
        <Title order={2}>Your Home Feed</Title>
        <Flex gap="md" wrap="wrap">
          {posts?.map((post) => (
            <Anchor
              key={post.id}
              href={`/posts/${post.id}`}
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
            </Anchor>
          ))}
        </Flex>
      </Stack>
    </ReactProviders>
  );
}
