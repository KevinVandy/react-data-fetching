import { useCallback, useEffect, useState } from "react";
import { LoaderFunction, MetaFunction } from "react-router";
import { Link, useLoaderData, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Card,
  Collapse,
  Flex,
  Loader,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { IUser, IPost } from "../api-types";

export const loader: LoaderFunction = async ({ params }) => {
  const { id: userId } = params;

  try {
    const [userResponse, postsResponse] = await Promise.all([
      fetch(`http://localhost:3300/users/${userId}`),
      fetch(`http://localhost:3300/users/${userId}/posts`),
    ]);

    const [initialUser, initialPosts] = await Promise.all([
      userResponse.json(),
      postsResponse.json(),
    ]);

    return {
      initialUser,
      initialPosts,
      error: false,
    };
  } catch (error) {
    console.error(error);

    return {
      initialUser: null,
      initialPosts: null,
      error: true,
    };
  }
};

interface IUserPageProps {
  initialUser: IUser;
  initialPosts: IPost[];
  error: boolean;
}

export const meta: MetaFunction = () => {
  return [{ title: "User - React Router SSR" }];
};

export default function UserPage() {
  const {
    initialUser,
    initialPosts,
    error: pageError,
  } = useLoaderData<IUserPageProps>();
  const { id: userId } = useParams();
  const userIdNumber = parseInt(userId!);

  // Load user - with initial data from SSR
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorLoadingUser,
  } = useQuery({
    queryKey: ["user", userIdNumber],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3300/users/${userIdNumber}`
      );
      return response.json() as Promise<IUser>;
    },
    initialData: initialUser, // SSR, with refresh
  });

  // Load user posts - with initial data from SSR
  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isErrorLoadingPosts,
    isFetching: isFetchingPosts,
  } = useQuery({
    queryKey: ["userPosts", userIdNumber],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3300/users/${userIdNumber}/posts`
      );
      return response.json() as Promise<IPost[]>;
    },
    initialData: initialPosts, // SSR, with refresh
  });

  if (pageError) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red">
        There was an error loading this page
      </Alert>
    );
  }

  return (
    <Stack>
      <Box>
        {isErrorLoadingUser ? (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Bummer!"
            color="red"
          >
            There was an error loading this user
          </Alert>
        ) : !user || isLoadingUser ? (
          <>
            <Skeleton animate height="20px" width="50%" mb="md" />
            <Skeleton animate height="40px" width="100%" mb="md" />
          </>
        ) : (
          <Card withBorder p="lg">
            <Title order={2}>{user.name}</Title>
            <Text>Email: {user.email}</Text>
            <Text>Phone: {user.phone}</Text>
            <Text>Website: {user.website}</Text>
            <Text component="div" mt="md">
              Address:
              <address>
                {user.address.street}, {user.address.suite},<br />
                {user.address.city}, {user.address.zipcode}
              </address>
            </Text>
            <Text component="div" mt="md">
              Company: {user.company.name}
            </Text>
          </Card>
        )}
      </Box>

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
            There was an error loading posts for this user
          </Alert>
        ) : isLoadingPosts ? (
          <Stack gap="md">
            {[...Array(3)].map((_, index) => (
              <Card withBorder key={index}>
                <Skeleton animate height="20px" width="25%" mb="md" />
                <Skeleton animate height="15px" width="33%" mb="md" />
                <Skeleton animate height="40px" width="100%" mb="md" />
              </Card>
            ))}
          </Stack>
        ) : (
          <Stack gap="md">
            {posts?.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  withBorder
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <Title order={3}>{post.title}</Title>
                  <Text>{post.body}</Text>
                </Card>
              </Link>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
