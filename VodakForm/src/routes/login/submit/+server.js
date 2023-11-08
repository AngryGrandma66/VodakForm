import { error } from '@sveltejs/kit';
import argon2 from "argon2";
import { serialize } from 'cookie';
import { createSession } from '$lib/sessionStore';
import { readRegistrations } from '$lib/fileRead.js'

async function findUser(searchValue) {
    try {
        const usersArray = readRegistrations()
        return usersArray.find(user => user.username === searchValue);
    } catch (err) {
        console.error('Error processing login:', err);
        throw error(500, 'Error processing login');
    }
}



async function authenticateUser(formData) {
    const user = await findUser(formData.loginUsername); // make sure the name of the form field matches
    if (!user) {
        console.log('User not found');
        return null; // Return null instead of false to indicate no user found
    }
    console.log()
    const passwordMatches = await argon2.verify(user.password, formData.loginPassword);

    return passwordMatches ? user : null;
}

export async function POST({ request }) {
    try {
        const formData = await request.json();
        const user = await authenticateUser(formData);
            if (!user) {
            // User not found or password doesn't match
            return new Response(JSON.stringify({ success: false, message: 'Invalid username or password' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // User is authenticated, create a session ID
        const sessionId = await createSession(user.username); // Use the username or another user identifier to create the session

        // Serialize the cookie
        const cookie = serialize('session_id', sessionId, {
            httpOnly: true,
            maxAge: 60 * 60 * 24, // 1 day in seconds
            sameSite: 'strict',
            path: '/',
            // Add 'secure: true' if you're serving your site over HTTPS
        });

        // Set the cookie in the response header
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
        // Handle any other errors
        return new Response(JSON.stringify({ success: false, message: 'An error occurred during login' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
