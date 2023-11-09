import {getSession, validateSession} from '$lib/sessionStore';

export async function handle({ event, resolve }) {
    try {
        const cookies = event.request.headers.get('cookie') || '';
        const sessionId = parseCookie(cookies, 'session_id');

        if (sessionId) {
            const userSession = await getSession(sessionId);
            if (userSession && validateSession(userSession)) {
                // @ts-ignore
                event.locals.user = userSession;
            }
        }
        return await resolve(event);
    } catch (err) {
        console.error('An error occurred:', err);
        throw err;
    }
}

/**
 * @param {any} cookieHeader
 * @param {string} name
 */
function parseCookie(cookieHeader, name) {
    const value = `; ${cookieHeader}`;
    const parts = value.split(`; ${name}=`);
    // @ts-ignore
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
