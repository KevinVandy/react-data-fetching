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
import { useQuery } from "@tanstack/react-query";

export function HomePage() {
  //load posts
  const {
    data: posts,
    isError: isErrorLoadingPosts,
    isFetching: isFetchingPosts,
    isLoading: isLoadingPosts,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const fetchUrl = new URL(`http://localhost:3333/posts`);

      const response = await fetch(fetchUrl.href);
      return response.json() as Promise<IPost[]>;
    },
  });

  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
      <Flex w="100%" justify={"center"} h="2rem">
        <Collapse in={isFetchingPosts}>
          <Loader />
        </Collapse>
      </Flex>
      <Flex gap="md" wrap="wrap">
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
          posts?.map((post) => (
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
          ))
        )}
      </Flex>
    </Stack>
  );
}
