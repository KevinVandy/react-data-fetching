import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    console.log(formData);
    const body = formData.get("body");
    const url = new URL(request.url);
    const postId = url.searchParams.get("postId");
    const redirectHash = url.searchParams.get("redirectHash");

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

    const redirectUrl = new URL(
      `/posts/${postId}${redirectHash ? "#" + redirectHash : ""}`,
      url.origin,
    );
    return Response.redirect(redirectUrl.toString(), 303);
  } catch (error) {
    console.error("Error creating comment:", error);
    return new Response("Error creating comment", { status: 500 });
  }
};
