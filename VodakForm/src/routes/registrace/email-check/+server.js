import { readRegistrations } from '$lib/fileRead.js'
/**
 * @param {any} email
 */
async function isEmailUnique(email) {
    const registrations = await readRegistrations();
    return !registrations.some((/** @type {{ email: any; }} */ reg) => reg.email === email);
}

export async function GET({ url }) {
    const email = url.searchParams.get('email');
    if (!email) {
        return new Response(null, { status: 400 });
    }
    const unique = await isEmailUnique(email);
    return new Response(unique ? 'Unique' : 'Duplicate', { status: unique ? 200 : 409 });
}
