// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type AccountProvider = {
		channel: string;
		identity: string;
		password?: null;
		credential?: null;
	};
	interface UserDTO {
		id: String;
		email: String;
		name: String;
		phone: String;
		providers: AccountProvider[];
		agreement: {
			consents: string[];
			terms: string[];
		};
	}

	type TokenProps = {
		accessToken: string;
		refreshToken: string;
	};
	type SNSChannel = 'google' | 'naver' | 'apple' | 'kakao';
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
