import {error, fail} from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { VITE_CLIENT_ID, VITE_CLIENT_SECRET } from '$env/static/private';
import { env } from '$env/dynamic/private';

const {
	VITE_API_HOST: api_host
} = env


export const load: PageServerLoad = async ({ cookies }) => {
	const accessToken = cookies.get('accessToken');
	const email = cookies.get('uemail');
	return { email, target: '/tax-accounting' };
};

export const actions: Actions = {
	login: async ({ request, fetch, cookies }) => {
		const data = await request.formData();
		const urlSearchParams = new URLSearchParams();
		for (const [key, value] of data) {
			urlSearchParams.append(key, String(value));
		}
		const step1 = await fetch(`${api_host}/account/v1/oauth/auth_code`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: urlSearchParams
		});
		if (!step1.ok) {
			const err = await step1.json()
			throw fail(step1.status, {error: err})
		}
		const { auth_code: code } = await step1.json();

		const tokenSearchParams = new URLSearchParams({
			client_id: VITE_CLIENT_ID,
			client_secret: VITE_CLIENT_SECRET,
			code,
			grant_type: 'authorization_code'
		});

		const step2 = await fetch(`${api_host}/account/v1/oauth/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: tokenSearchParams
		});

		const res = await step2.json()
		if (!step2.ok) {
			throw error(500, res);
		} else{
			if(cookies.get('channel')){
				cookies.delete('channel');
			}
		}
		return res;
	}
};
