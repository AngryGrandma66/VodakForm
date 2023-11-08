import adapter from '@sveltejs/adapter-node';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}
export default {
	kit: {
		adapter: adapter()
	}
};