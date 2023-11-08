import { endSession } from '$lib/sessionStore';
import { serialize } from 'cookie';

export async function GET({ locals }) {
    // Terminate the session in your session storage
    await endSession(locals.user?.sessionId);

    // Clear the session cookie
    const headers = {
        'Set-Cookie': serialize('session_id', '', {
            path: '/',
            httpOnly: true, // Cookie is not accessible via JavaScript
            expires: new Date(0), // set the cookie to expire immediately
            // SameSite can be set to strict for additional security
            sameSite: 'strict',
        }),
    };

    // Redirect to home or login page after logout
    return new Response(null, {
        status: 303, // Status code 303 means "See Other" (a redirect with GET method)
        headers: {
            ...headers,
            'Location': '/', // or '/' for redirecting to the home page
        }
    });
}
