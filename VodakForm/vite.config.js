import { sveltekit } from '@sveltejs/kit/vite';
import path from "path";

const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$styles: path.resolve('./src/styles') // Alias for styles
		}
	}
	// ... other configurations
};

export default config;