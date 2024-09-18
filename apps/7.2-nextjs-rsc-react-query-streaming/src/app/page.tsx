"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IPost } from "@/api-types";
import {
  ActionIcon,
  Card,
  Flex,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

export const runtime = "edge";

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
  const { data: posts, refetch: refetchPosts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      console.log("fetching posts");
      const fetchUrl = new URL(`http://localhost:3333/posts`);
      const response = await fetch(fetchUrl.href, {
        cache: "no-store",
      });
      const fetchedPosts = (await response.json()) as IPost[];
      return fetchedPosts;
    },
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
