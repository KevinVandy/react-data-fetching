import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Card,
  Collapse,
  Flex,
  Loader,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { type IPost, type IUser } from "../api-types";

export const UserPage = () => {
  const { id: userId } = useParams();

  //load user
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorLoadingUser,
  } = useQuery({
    enabled: !!userId,
    queryKey: ["users", userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3300/users/${userId}`);
      return response.json() as Promise<IUser>;
    },
  });

  //load user posts
  const {
    data: posts,
    isLoading: isLoadingPosts,
    isFetching: isFetchingPosts,
    isError: isErrorLoadingPosts,
  } = useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      const fetchUrl = new URL(`http://localhost:3300/posts?userId=${userId}`);
      const response = await fetch(fetchUrl.href);
      return response.json() as Promise<IPost[]>;
    },
  });

  if (isErrorLoadingUser) {
    return (
      <Alert title="Error loading user" icon={<IconAlertCircle />} color="red">
        There was an error loading the user
      </Alert>
    );
  }

  if (isLoadingUser) {
    return (
      <Flex w="100%" justify="center">
        <Loader />
      </Flex>
    );
  }

  return (
    <Stack>
      <Paper p="lg">
        <Title order={2}>{user?.name}</Title>
        <Text>Email: {user?.email}</Text>
        <Text>Phone: {user?.phone}</Text>
        <Text>Website: {user?.website}</Text>
        <Text component="div">
          Address:
          <address>
            {user?.address.street}, {user?.address.suite},<br />
            {user?.address.city}, {user?.address.zipcode}
          </address>
        </Text>
      </Paper>
      <Stack>
        <Flex w="100%" justify="center" mih="2rem">
          <Collapse in={isFetchingPosts}>
            <Loader />
          </Collapse>
        </Flex>
        <Stack gap="xl">
          <Title order={2}>{user?.name}'s Posts</Title>
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
              <Card withBorder key={index}>
                <Skeleton animate height="20px" width="50%" mb="md" />
                <Skeleton animate height="40px" width="100%" mb="md" />
              </Card>
            ))
          ) : (
            posts?.map((post) => (
              <Link
                key={post.id}
                to={`/spa/posts/${post.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  withBorder
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <Title order={2}>{post.title}</Title>
                  <Text>{post.body}</Text>
                </Card>
              </Link>
            ))
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
