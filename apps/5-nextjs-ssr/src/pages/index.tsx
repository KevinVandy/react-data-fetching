import { GetServerSideProps } from "next";
import { Alert, Card, Flex, Stack, Text, Title } from "@mantine/core";
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
      <Flex gap="md" wrap="wrap">
        {error ? (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Bummer!"
            color="red"
          >
            There was an error fetching posts
          </Alert>
        ) : (
          posts?.map((post) => (
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
          ))
        )}
      </Flex>
    </Stack>
  );
}
