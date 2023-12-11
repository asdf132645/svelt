import type {PageServerLoad} from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	return JSON.parse(cookies.get('dv.principal') || '{}');
};
