// pages/home.tsx
import { GetServerSideProps } from "next";
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
import { IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { type IPost } from "../api-types";

interface HomePageProps {
  posts: IPost[];
  error: boolean;
}

const HomePage = ({ posts, error }: HomePageProps) => {
  //posts states
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);

  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
      <Flex w="100%" justify={"center"} h="2rem">
        <Collapse in={isFetchingPosts}>
          <Loader />
        </Collapse>
      </Flex>
      <Stack gap="md">
        {error ? (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Bummer!"
            color="red"
          >
            There was an error fetching posts
          </Alert>
        ) : !posts.length ? (
          [...Array(5)].map((_, index) => (
            <Card withBorder shadow="md" key={index}>
              <Skeleton animate height="20px" width="50%" mb="md" />
              <Skeleton animate height="40px" width="100%" mb="md" />
            </Card>
          ))
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                withBorder
                shadow="md"
                style={{
                  cursor: "pointer",
                }}
              >
                <Title order={3}>{post.title}</Title>
                <Text>{post.body}</Text>
              </Card>
            </Link>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const fetchUrl = new URL(`https://jsonplaceholder.typicode.com/posts`);
    const response = await fetch(fetchUrl.href);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate slow network
    const fetchedPosts = (await response.json()) as IPost[];

    return {
      props: {
        posts: fetchedPosts,
        error: false,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        posts: [],
        error: true,
      },
    };
  }
};

export default HomePage;
