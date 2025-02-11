"use client";

import { ActionIcon, Card, Flex, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchPosts } from "./page";
import { IconRefresh } from "@tabler/icons-react";

export function PostsFeed() {
  const { data: posts, refetch: refetchPosts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    // select: (data) =>
    //   typeof window !== "undefined"
    //     ? data.sort(() => Math.random() - 0.5)
    //     : data,
  });

  return (
    <Stack>
      <ActionIcon variant="transparent" onClick={() => refetchPosts()}>
        <IconRefresh />
      </ActionIcon>
      <Flex gap="md" wrap="wrap">
        {posts.map((post) => (
          <Link
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
          </Link>
        ))}
      </Flex>
    </Stack>
  );
}
