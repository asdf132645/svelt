import { env } from '$env/dynamic/private';
import type {Actions, ServerLoad} from "@sveltejs/kit";
import {fail} from "@sveltejs/kit";
const { VITE_API_HOST: api_host } = env;

const STAT = 'dr.village.password.change'

export const load: ServerLoad = async ({ fetch, url}) => {
	const t = url.searchParams.get('t');
	if (t) {
		const endpoint = new URL(`${api_host}/account/v1/cert/email`);
		endpoint.searchParams.append('t', t);

		const token_res = await fetch(endpoint);
		if (!token_res.ok) {
			const err = await token_res.json()
			return { identity: null, csrf: null , err}
		}

		const {identity} = await token_res.json();
		const csrf_res = await fetch(
			`${api_host}/account/v1/csrf`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					identity: identity,
					stat: STAT
				})
			}
		);
		if (!csrf_res.ok) {
			const err = await csrf_res.json()
			return { identity: null, csrf: null , err}
		}
		const {csrf} = await csrf_res.json()

		return {identity, csrf};
	}
}

export const actions: Actions = {
	default: async ({ fetch, request, url }) => {
		const data = await request.formData();
		const {
			identity,
			csrf,
			passwordNew
		} = Object.fromEntries(data);
		const payload = {
			identity,
			passwordNew,
			token: {
				identity: identity,
				stat: STAT,
				csrf: csrf
			},
		};

		fetch(`${api_host}/account/v1/user/password`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
	}
};
