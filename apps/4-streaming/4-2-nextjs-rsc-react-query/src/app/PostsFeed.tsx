"use client";

import { ActionIcon, Card, Flex, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IconRefresh } from "@tabler/icons-react";
import { IPost } from "@/api-types";

const fetchPosts = async (): Promise<IPost[]> => {
  console.log("fetching posts");
  const fetchUrl = new URL(`http://localhost:3300/posts`);
  const response = await fetch(fetchUrl.href);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const fetchedPosts = (await response.json()) as IPost[];
  return fetchedPosts;
};

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
