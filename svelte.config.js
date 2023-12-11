import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

const BASE_PATH = process.env.BASE_PATH || ''

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'@/*': './src/*'
		},
		paths: {
			base: `${BASE_PATH}`,
		},
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
