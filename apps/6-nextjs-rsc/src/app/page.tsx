import { IPost } from "@/api-types";
import Link from "next/link";
import { Suspense } from "react";

const fetchPosts = async () => {
  const fetchUrl = new URL(`https://jsonplaceholder.typicode.com/posts`);
  const response = await fetch(fetchUrl.href);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate slow network
  const fetchedPosts = (await response.json()) as IPost[];
  return fetchedPosts;
};

export default async function HomePage() {
  const posts = await fetchPosts();

  return (
    <div>
      <h2>Your Home Feed</h2>
      <div style={{ padding: "1rem" }}>
        <Suspense fallback={<div>Loading...</div>}>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  margin: "1rem 0",
                  border: "1px solid #e1e1e1",
                }}
              >
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </div>
            </Link>
          ))}
        </Suspense>
      </div>
    </div>
  );
}
