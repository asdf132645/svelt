import { env } from '$env/dynamic/private';
import { base } from '$app/paths';
const { VITE_API_HOST: api_host } = env;

export async function POST({ url, request }) {
	const data = await request.json();
	const { email, channel, identity, username } = data;

	const payload = {
		receiver: email,
		data: {
			channel,
			identity: identity,
			name: username,
		},
		action: 'verify-email',
		link_uri: `${url.origin}${base}/join/integration`
	};

	const res = await fetch(`${api_host}/account/v1/cert/email`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	return new Response('ok');
}
