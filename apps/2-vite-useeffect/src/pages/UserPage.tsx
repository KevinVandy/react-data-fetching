import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { IPost, IUser } from "../api-types";

export const UserPage = () => {
  const { id: userId } = useParams();

  //user states
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isErrorLoadingUser, setIsErrorLoadingUser] = useState(false);

  //user posts states
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isErrorLoadingPosts, setIsErrorLoadingPosts] = useState(false);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);

  //load user
  const fetchUser = async () => {
    setIsLoadingUser(true);
    try {
      const fetchUrl = new URL(`http://localhost:3333/users/${userId}`);
      const response = await fetch(fetchUrl.href);
      const fetchedUser = (await response.json()) as IUser;
      setUser(fetchedUser);
    } catch (error) {
      console.error(error);
      setIsErrorLoadingUser(true);
    } finally {
      setIsLoadingUser(false);
    }
  };

  //load user posts
  const fetchPosts = async () => {
    if (!posts.length) {
      setIsLoadingPosts(true);
    }
    setIsFetchingPosts(true);
    try {
      const fetchUrl = new URL(`http://localhost:3333/posts?userId=${userId}`);
      const response = await fetch(fetchUrl.href);
      const fetchedPosts = (await response.json()) as IPost[];
      setPosts(fetchedPosts);
    } catch (error) {
      console.error(error);
      setIsErrorLoadingPosts(true);
    } finally {
      setIsLoadingPosts(false);
      setIsFetchingPosts(false);
    }
  };

  //load user and user posts on mount
  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

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
                to={`/posts/${post.id}`}
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
