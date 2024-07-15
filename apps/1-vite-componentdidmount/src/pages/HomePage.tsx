import { Component } from "react";
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

interface HomePageState {
  posts: IPost[];
  isLoadingPosts: boolean;
  isErrorLoadingPosts: boolean;
  isFetchingPosts: boolean;
}

export class HomePage extends Component<{}, HomePageState> {
  state: HomePageState = {
    posts: [],
    isLoadingPosts: false,
    isErrorLoadingPosts: false,
    isFetchingPosts: false,
  };

  fetchPosts = async () => {
    const { posts } = this.state;

    if (!posts.length) {
      this.setState({ isLoadingPosts: true });
    }
    this.setState({ isFetchingPosts: true });

    try {
      const fetchUrl = new URL(`http://localhost:3333/posts`);
      const response = await fetch(fetchUrl.href);
      const fetchedPosts = (await response.json()) as IPost[];
      this.setState({ posts: fetchedPosts });
    } catch (error) {
      console.error(error);
      this.setState({ isErrorLoadingPosts: true });
    } finally {
      this.setState({ isLoadingPosts: false, isFetchingPosts: false });
    }
  };

  componentDidMount() {
    this.fetchPosts();
  }

  render() {
    const { posts, isLoadingPosts, isErrorLoadingPosts, isFetchingPosts } =
      this.state;

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
}
