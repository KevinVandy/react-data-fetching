import type { IPost } from '$lib/api-types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const fetchUrl = new URL(`http://localhost:3333/posts`);
		const response = await fetch(fetchUrl.href);
		const fetchedPosts = (await response.json()) as IPost[];

		return {
			posts: fetchedPosts,
			error: false
		};
	} catch (error) {
		console.error(error);
		return {
			posts: [],
			error: true
		};
	}
};
