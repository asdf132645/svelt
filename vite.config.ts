import { sveltekit } from '@sveltejs/kit/vite';
import {
	defineConfig,
	loadEnv,
	UserConfig
} from 'vite';

export default ({ mode }: UserConfig) => {
	process.env = {...process.env, ...loadEnv(mode || '', process.cwd())};
	const PORT = parseInt(process.env.PORT) || 3000

	return defineConfig({
		plugins: [sveltekit()],
		server: {
			port: PORT,
			strictPort: false,
			proxy: {
				'/health': {
					target: `http://localhost:${PORT}${process.env.BASE_PATH}`,
				},
				'/api/proxy': {
					target: `${process.env.VITE_API_HOST}`,
					rewrite: path => path.replace(/^\/api\/proxy/, ''),
					changeOrigin: true,
				}
			}
		},
	});
}