import type {Actions} from './$types';
import {env} from '$env/dynamic/private';
import {fail} from '@sveltejs/kit';

const { VITE_API_HOST: api_host } = env;

export const actions: Actions = {
	default: async ({ request, url }) => {
		const data = await request.formData();
		const email = data.get('email');
		const retry = data.get('retry');
		const host = data.get('host_address');

		/** 비밀번호 찾으려는 이메일 회원가입 여부 */
		const res = await fetch(`${api_host}/account/v1/user/email/${email}?f=name,phone`);
		if (!res.ok) return fail(500, { message: '요청 실패.' });

		const { accounts } = await res.json();
		const account = accounts.filter((mail: any) => mail.matched)[0]

		if (!account || account.channel != 'email') {
			return fail(400, { message: '존재하지 않는 계정입니다.' })
		}

		// 이메일 요청
		const payload = {
			receiver: email,
			channel: 'email',
			action: 'change-password',
			data: {
				name: account.name,
				identity: account.accountId
			},
			link_uri: `${host}/password`
		};

		const verify_res = await fetch(`${api_host}/account/v1/cert/email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload)
		});

		if (verify_res.ok) {
			return { ...await verify_res.json(), retry };
		} else {
			const err = await verify_res.json()
			return { ...fail(verify_res.status, err), retry };
		}
	}
};
