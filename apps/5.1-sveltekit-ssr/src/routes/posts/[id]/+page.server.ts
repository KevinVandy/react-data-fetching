import type { IComment, IPost } from '$lib/api-types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { id: postId } = params;

	try {
		const [postResponse, commentsResponse] = await Promise.all([
			fetch(`http://localhost:3333/posts/${postId}`),
			fetch(`http://localhost:3333/posts/${postId}/comments`)
		]);

		const [initialPost, initialComments] = await Promise.all([
			postResponse.json() as Promise<IPost>,
			commentsResponse.json() as Promise<IComment[]>
		]);

		return {
			initialPost,
			initialComments,
			error: false
		};
	} catch (error) {
		console.error(error);

		return {
			initialPost: null,
			initialComments: [],
			error: true
		};
	}
};
