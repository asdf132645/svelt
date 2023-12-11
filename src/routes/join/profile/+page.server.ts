import type {ServerLoad} from '@sveltejs/kit';
import type {Actions} from './$types';
import {env} from '$env/dynamic/private';
import {accountId} from "@/store/WritableStore";
import {setCookie} from "@/utils/cookie";

const { VITE_API_HOST: api_host } = env;

export const load: ServerLoad = ({ cookies }) => {
	const data = JSON.parse(cookies.get('dv.principal') ?? '{}')
	console.log(data)
	cookies.delete('dv.principal', {path: "/"})

	return data;
};
// export const consentCheck = writable<ConSentList>({});


export const actions: Actions = {
	createAccount: async ({ request, fetch, cookies }) => {
		const form_data = await request.formData();
		const {
			email,
			username: name,
			phone,
			password,
			channel,
			email_verified,
			host_address,
			identity,
			credential,
			agreementObj,
			phoneNumber,
		} = Object.fromEntries(form_data);
		console.log('form_data=>', form_data)
		let accountId ;
		console.log(agreementObj)
		const reqData = {
			email,
			name:name,
			phone: phone,
			provider: {
				channel: channel || 'email',
				password,
				identity: (identity || email) === 'undefined' ? null : identity || email,
				credential: credential !==  'undefined' ? credential : null,
			},
			agreement: JSON.parse(agreementObj as string)
		};

		console.log('reqData=>',reqData)
		const userPostResponse = await fetch(`${api_host}/account/v1/join/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(reqData)
		});

		console.log('userPostResponse =>', userPostResponse)

		if (userPostResponse.ok) {
			const user = await userPostResponse.json()

			// email 인증이 필요한 경우 이메일 인증 요청을 보낸다.
			if (email_verified == "false") {
				const res = await fetch(`${api_host}/account/v1/cert/email`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						receiver: email,
						action: 'verify-email',
						data: {
							identity: user.id,
							channel: channel || 'email',
							name: user.name,
						},
						link_uri: host_address
					})
				});
			}
			console.log(email_verified)
			return { channel, identity: user.id, name: user.name, email: email, email_verified };
		} else {
			throw await userPostResponse.json()
		}
	}
};
