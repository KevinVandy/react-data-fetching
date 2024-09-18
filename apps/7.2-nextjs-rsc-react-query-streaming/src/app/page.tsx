"use client";

import { Suspense } from "react";
import Link from "next/link";
import { IPost } from "@/api-types";
import { Card, Flex, Loader, Stack, Text, Title } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";

export const runtime = "edge"; // 'nodejs' (default) | 'edge'

export default function HomePage() {
  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
      <Suspense fallback={<Loader />}>
        <Posts />
      </Suspense>
    </Stack>
  );
}

function Posts() {
  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const fetchUrl = new URL(`http://localhost:3333/posts`);
      const response = await fetch(fetchUrl.href, {
        cache: "no-store",
      });
      const fetchedPosts = (await response.json()) as IPost[];
      return fetchedPosts;
    },
  });

  return (
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
  );
}
