import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const channel = cookies.get('channel');
	channel && cookies.delete('channel', { path: '/' });
	return { channel };
};
