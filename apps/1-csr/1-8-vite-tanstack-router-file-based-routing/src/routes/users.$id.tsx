import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  Card,
  Collapse,
  Flex,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userQueryOptions } from "../queries/users";
import { userPostsQueryOptions } from "../queries/posts";

export const Route = createFileRoute("/users/$id")({
  loader: async ({ context: { queryClient }, params: { id } }) => {
    const userId = parseInt(id);

    // Load both user and their posts in parallel
    await Promise.all([
      queryClient.ensureQueryData(userQueryOptions(userId)),
      queryClient.ensureQueryData(userPostsQueryOptions(userId)),
    ]);
  },
  component: UserPage,
});

function UserPage() {
  const { id: userId } = useParams({ from: "/users/$id" });
  const userIdNumber = parseInt(userId);

  // All data is already loaded by the route loader, so these will resolve immediately
  const { data: user } = useSuspenseQuery(userQueryOptions(userIdNumber));
  const { data: posts, isFetching: isFetchingPosts } = useSuspenseQuery(
    userPostsQueryOptions(userIdNumber),
  );

  return (
    <Stack>
      <Paper p="lg">
        <Title order={2}>{user.name}</Title>
        <Text>Email: {user.email}</Text>
        <Text>Phone: {user.phone}</Text>
        <Text>Website: {user.website}</Text>
        <Text component="div">
          Address:
          <address>
            {user.address.street}, {user.address.suite},<br />
            {user.address.city}, {user.address.zipcode}
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
          <Title order={2}>{user.name}'s Posts</Title>
          {posts.map((post) => (
            <Link
              key={post.id}
              to="/posts/$id"
              params={{ id: post.id.toString() }}
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
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
