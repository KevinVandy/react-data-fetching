import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    console.log(formData);
    const body = formData.get("body");
    const postId = new URL(request.url).searchParams.get("postId");

    if (!body || !postId) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newComment = {
      body,
      email: "user@mailinator.com",
      name: "User",
      postId: Number(postId),
    };

    const response = await fetch("http://localhost:3300/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    if (!response.ok) throw new Error("Failed to create comment");

    // Get the current origin from the request URL
    const url = new URL(request.url);
    const redirectUrl = new URL(`/posts/${postId}`, url.origin);

    return Response.redirect(redirectUrl.toString(), 303);
  } catch (error) {
    console.error("Error creating comment:", error);
    return new Response("Error creating comment", { status: 500 });
  }
};
