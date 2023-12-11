import {error, fail, json} from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const { VITE_API_HOST: api_host } = env;

export const POST: RequestHandler = async ({ fetch, params: { phone_number } }: RequestEvent) => {
	const endpoint = new URL(`${api_host}/account/v1/user`);
	endpoint.searchParams.append('phone', phone_number);

	const res = await fetch(endpoint)
	if (res.status == 404) {
		return json([])
	} else if(!res.ok) {
		const err = await res.json()
		throw fail(res.status, err)
	}

	const account = await res.json();
	const emails = account.providers.map(p => {
		return {
			identity: account.id,
			email: p.email,
			channel: p.channel
		}
	})

	return json(emails);
};
