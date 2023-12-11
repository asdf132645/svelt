import { env } from '$env/dynamic/private';
import { base } from '$app/paths';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
const { VITE_API_HOST: api_host } = env;

export const GET: RequestHandler = async ({url}) => {
	const id = url.searchParams.get("identity")
    const res = await fetch(`${api_host}/account/v1/join/user/${id}`);

	if (!res.ok) {
		const err = await res.json()
		throw new Error(err.message);
	}

	const {identity, email, username, channel, candidates} = await res.json();

    return json({identity, email, username, channel, candidates}  )
}


