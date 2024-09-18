import {
  Alert,
  Card,
  Collapse,
  Flex,
  Loader,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons-react";
import { type IPost } from "../api-types";
import { useInfiniteQuery } from "@tanstack/react-query";

const numberOfPostsToLoad = 10;
const maxNumberOfPosts = 100;

export function HomePage() {
  //load posts
  const {
    data: posts,
    isError: isErrorLoadingPosts,
    isFetching: isFetchingPosts,
    isLoading: isLoadingPosts,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 0 }) => {
      const fetchUrl = new URL(
        `http://localhost:3333/posts?_page=${pageParam}&_limit=${numberOfPostsToLoad}`,
      );

      const response = await fetch(fetchUrl.href);
      return response.json() as Promise<IPost[]>;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
  });

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight - 100 &&
      !isFetchingPosts &&
      (posts?.pages?.length ?? 0) * numberOfPostsToLoad < maxNumberOfPosts
    ) {
      fetchNextPage();
    }
  };

  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
      <Flex w="100%" justify={"center"} h="2rem">
        <Collapse in={isFetchingPosts}>
          <Loader />
        </Collapse>
      </Flex>
      <Flex
        bd="solid 4px black"
        gap="md"
        wrap="wrap"
        mah="720"
        p="xl"
        style={{
          overflow: "auto",
        }}
        onScroll={onScroll}
      >
        {isErrorLoadingPosts ? (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Bummer!"
            color="red"
          >
            There was an error fetching posts
          </Alert>
        ) : isLoadingPosts ? (
          [...Array(5)].map((_, index) => (
            <Card w={300} mih={300} withBorder shadow="md" key={index}>
              <Skeleton animate height="20px" width="50%" mb="md" />
              <Skeleton animate height="40px" width="100%" mb="md" />
            </Card>
          ))
        ) : (
          posts?.pages.map((page) =>
            page.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
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
            )),
          )
        )}
      </Flex>
    </Stack>
  );
}
