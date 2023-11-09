import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter({
			// default options are shown
			out: 'build',
			precompress: false,
			env: {
				port: 'PORT'
			}
		}),
		// Include other configuration options here
	}
};