import {getSession, validateSession} from '$lib/sessionStore';

export async function handle({ event, resolve }) {
    const cookies = event.request.headers.get('cookie') || '';
    const sessionId = parseCookie(cookies, 'session_id');

    if (sessionId) {
        const userSession = await getSession(sessionId);
        if (userSession && validateSession(userSession)) { // Check if userSession is not undefined
            // @ts-ignore
            event.locals.user = userSession;
        }
    }
    // If the session is not valid, `event.locals.user` will be undefined
    return resolve(event);
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
