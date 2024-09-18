"use client";

import { Card, Flex, Loader, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import React, { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchPosts } from "./page";

export function PostsFeed() {
  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
      <Flex gap="md" wrap="wrap">
        <Suspense fallback={<Loader />}>
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
        </Suspense>
      </Flex>
    </Stack>
  );
}