import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import type { CheckEmailTypes } from '@/components/types/email';
import {base} from "$app/paths";

const { VITE_API_HOST: api_host } = env;

export const GET: RequestHandler = async ({ fetch, params: { email } }: RequestEvent) => {
	const response = await fetch(`${api_host}/account/v1/user/email/${email}`);
	const checkResult: CheckEmailTypes = await response.json();
	return json(checkResult.accounts.filter(acc => acc.matched));
};
