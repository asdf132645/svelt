import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const { VITE_API_HOST: api_host } = env;

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const { phone } = await request.json();

	const res = await fetch(`${api_host}/account/v1/cert/sms`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			phone,
			action: 'find-account'
		})
	});

	const data = await res.json();
	return json(data);
};
