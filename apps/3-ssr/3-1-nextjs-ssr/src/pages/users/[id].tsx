import { useCallback, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { IUser, IPost } from "../../api-types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GetServerSideProps } from "next";

//Load user and posts on server side for SEO
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id: userId } = context.params!;

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
      props: {
        initialUser,
        initialPosts,
        error: false,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        initialUser: null,
        initialPosts: null,
        error: true,
      },
    };
  }
};

interface IUserPageProps {
  initialUser: IUser;
  initialPosts: IPost[];
  error: boolean;
}

export default function UserPage({
  initialUser,
  initialPosts,
  error: pageError,
}: IUserPageProps) {
  const { id: userId } = useParams();
  const userIdNumber = parseInt(userId as string);

  // Load user - with initial data from server
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorLoadingUser,
  } = useQuery({
    initialData: initialUser,
    queryKey: [`/users/${userIdNumber}`],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3300/users/${userIdNumber}`
      );
      return response.json() as Promise<IUser>;
    },
  });

  // Load user posts - with initial data from server
  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isErrorLoadingPosts,
    isFetching: isFetchingPosts,
  } = useQuery({
    initialData: initialPosts,
    queryKey: [`/users/${userIdNumber}/posts`],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3300/users/${userIdNumber}/posts`
      );
      return response.json() as Promise<IPost[]>;
    },
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
                href={`/posts/${post.id}`}
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
