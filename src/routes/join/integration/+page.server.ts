import { redirect, type ServerLoad } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
const { VITE_API_HOST: api_host } = env;
import {base} from '$app/paths';


export const load: ServerLoad = async ({ fetch, url, cookies }) => {
	const token = url.searchParams.get('t');

	if (token) {
		const checkTokenURL = new URL(`${api_host}/account/v1/cert/email`);
		checkTokenURL.searchParams.append('t', token);

		const step1 = await fetch(checkTokenURL);
		console.log('step1step1step1step1step1step1step1step1step1step1step1step1step1step1step1')
		console.log(step1)

		if (!step1.ok) {
			return  { err: 'ok', identity: null, email: null, channel: null, name: null}
			// throw new Error('유효한 토큰이 아닙니다');
		}
		const { identity, channel, name } = await step1.json();

		return { identity: identity, email: 'email', channel, name, err: null};
	}

	return { identity: null, email: null, channel: null, name: null, err: null}
};
