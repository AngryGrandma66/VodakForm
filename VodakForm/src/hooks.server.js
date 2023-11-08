// src/hooks.server.js
import { parse } from 'cookie';
// src/hooks.server.js
import { getSession } from '$lib/sessionStore';

export async function handle({ event, resolve }) {
    const cookies = event.request.headers.get('cookie') || '';
    const sessionId = parseCookie(cookies, 'session_id');
    event.locals.user = await getSession(sessionId);

    return resolve(event);
}

function parseCookie(cookieHeader, name) {
    // Parse the Cookie header to find the session_id cookie
}
