import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const commentId = formData.get("commentId");
    const postId = formData.get("postId");
    const url = new URL(request.url);
    const redirectHash = url.searchParams.get("redirectHash");

    if (!commentId || !postId) {
      return new Response("Missing required fields", { status: 400 });
    }

    const response = await fetch(
      `http://localhost:3300/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) throw new Error("Failed to delete comment");

    const redirectUrl = new URL(
      `/posts/${postId}${redirectHash ? "#" + redirectHash : ""}`,
      url.origin
    );
    return Response.redirect(redirectUrl.toString(), 303);
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new Response("Error deleting comment", { status: 500 });
  }
};
