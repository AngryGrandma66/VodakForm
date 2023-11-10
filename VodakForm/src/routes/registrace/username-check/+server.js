import { readRegistrations } from '$lib/fileRead.js'
/**
 * @param {any} username
 */
async function isUsernameUnique(username) {
    const registrations = await readRegistrations();
    return !registrations.some((/** @type {{ username: any; }} */ reg) => reg.username === username);
}

export async function GET({ url }) {
    const username = url.searchParams.get('username');
    if (!username) {
        return new Response(null, { status: 400 });
    }
    const unique = await isUsernameUnique(username);
    return new Response(unique ? 'Unique' : 'Duplicate', { status: unique ? 200 : 409 });
}
