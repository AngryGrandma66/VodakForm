import {getSession, validateSession} from '$lib/sessionStore';

export async function handle({ event, resolve }) {
    const cookies = event.request.headers.get('cookie') || '';
    const sessionId = parseCookie(cookies, 'session_id');
    const userSession = await getSession(sessionId);

    if (userSession && validateSession(userSession)) {
        event.locals.user = userSession.userId;
    } else {
        event.locals.user = null;
    }

    return resolve(event);
}

function parseCookie(cookieHeader, name) {
    const value = `; ${cookieHeader}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
