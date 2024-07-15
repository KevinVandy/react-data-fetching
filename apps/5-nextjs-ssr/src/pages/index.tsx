import { GetServerSideProps } from "next";
import { Alert, Card, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";
import { type IPost } from "../api-types";

//Load posts on server side for SEO
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const fetchUrl = new URL(`http://localhost:3333/posts`);
    const response = await fetch(fetchUrl.href);
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

interface HomePageProps {
  posts: IPost[];
  error: boolean;
}

export default function HomePage({ posts, error }: HomePageProps) {
  return (
    <Stack>
      <Title order={2}>Your Home Feed</Title>
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
}
