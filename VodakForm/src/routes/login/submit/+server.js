import { error } from '@sveltejs/kit';
import argon2 from "argon2";
import { serialize } from 'cookie';
import { createSession } from '$lib/sessionStore';
import { readRegistrations } from '$lib/fileRead.js'

/**
 * @param {any} searchValue
 */
async function findUser(searchValue) {
    try {
        const usersArray = await readRegistrations()
        return usersArray.find((/** @type {{ username: any; }} */ user) => user.username === searchValue);
    } catch (err) {
        console.error('Error processing login:', err);
        throw error(500, 'Error processing login');
    }
}



/**
 * @param {{ loginUsername: any; loginPassword: string | Buffer; }} formData
 */
async function authenticateUser(formData) {
    const user = await findUser(formData.loginUsername); 
    if (!user) {
        return null; 
    }
    const passwordMatches = await argon2.verify(user.password, formData.loginPassword);

    return passwordMatches ? user : null;
}

export async function POST({ request }) {
    try {
        const formData = await request.json();
        const user = await authenticateUser(formData);
            if (!user) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid username or password' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const sessionId = await createSession(user.username); 

        const cookie = serialize('session_id', sessionId, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            sameSite: 'strict',
            path: '/',
        });

        return new Response(JSON.stringify({
            success: true,
            message: 'Logged in successfully',
        }), {
            status: 200,
            headers: {
                'Set-Cookie': cookie,
                'Content-Type': 'application/json'
            },
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: 'An error occurred during login' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
