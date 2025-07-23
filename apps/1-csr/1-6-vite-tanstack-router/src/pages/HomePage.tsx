import { Suspense } from "react";
import { Alert, Card, Flex, Skeleton, Stack, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { IconAlertCircle } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQueryOptions } from "../queries/posts";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

export function HomePage() {
  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
      <Flex wrap="wrap" gap="1rem">
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              fallbackRender={() => <HomePageError />}
              onReset={reset}
            >
              <Suspense fallback={<HomePageSkeleton />}>
                <HomePagePosts />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Flex>
    </Stack>
  );
}

function HomePageSkeleton() {
  return [...Array(5)].map((_, index) => (
    <Card w={300} mih={300} withBorder shadow="md" key={index}>
      <Skeleton animate height="20px" width="50%" mb="md" />
      <Skeleton animate height="40px" width="100%" mb="md" />
    </Card>
  ));
}

function HomePageError() {
  return (
    <Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red">
      There was an error fetching posts
    </Alert>
  );
}

function HomePagePosts() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions);

  return posts.map((post) => (
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
  ));
}
