import { writable } from 'svelte/store';

export type ConSentList = {
	eventConsent?: boolean;
	agreement?: {
		terms: (string | undefined)[];
		consents: string[];
	};
};
export const responseStore = writable<any>(null);

export const consentCheck = writable<ConSentList>({});
