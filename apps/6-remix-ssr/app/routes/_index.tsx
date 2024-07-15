import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Alert, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { IPost } from "../api-types";

interface LoaderData {
  posts: IPost[];
  error: boolean;
}

export const loader: LoaderFunction = async () => {
  try {
    const fetchUrl = new URL(`http://localhost:3333/posts`);
    const response = await fetch(fetchUrl.href);
    const fetchedPosts = (await response.json()) as IPost[];

    return json<LoaderData>({
      posts: fetchedPosts,
      error: false,
    });
  } catch (error) {
    console.error(error);

    return json<LoaderData>({
      posts: [],
      error: true,
    });
  }
};

export const meta: MetaFunction = () => {
  return [{ title: "Remix SSR" }];
};

export default function HomePage() {
  const { posts, error } = useLoaderData<LoaderData>();

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
