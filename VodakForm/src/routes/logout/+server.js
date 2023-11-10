import { endSession } from '$lib/sessionStore';
import { serialize } from 'cookie';

export async function GET({ locals }) {
    await endSession(locals.user?.sessionId);

    const headers = {
        'Set-Cookie': serialize('session_id', '', {
            path: '/',
            httpOnly: true,
            expires: new Date(0), 
            sameSite: 'strict',
        }),
    };

    return new Response(null, {
        status: 303, 
        headers: {
            ...headers,
            'Location': '/', 
        }
    });
}
