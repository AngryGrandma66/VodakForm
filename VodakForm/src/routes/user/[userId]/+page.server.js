import {error, redirect} from '@sveltejs/kit';
import {getSession, validateSession} from '$lib/sessionStore.js';
import {readBoats, readRegistrations} from "$lib/fileRead.js";

export async function load({request}) {
    const cookies = request.headers.get('cookie') || '';
    const sessionId = parseCookie(cookies, 'session_id');
    const session = await getSession(sessionId);

    if (!session || !validateSession(session)) {
        throw redirect(302, '/login');
    }

    const userData = await fetchUserData(session.userId);
    const boats = await fetchBoats();

    const invitations = await fetchInvitations(session.userId)

    return {
        props: {
            userData, boats, invitations
        }
    };
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

/**
 * @param {any} userId
 */
async function fetchUserData(userId) {
    try {
        const usersArray = await readRegistrations();
        return usersArray.find((/** @type {{ username: any; }} */ user) => user.username === userId)
    } catch (err) {
        console.error('Error fetching user data:', err);
        throw error(500, 'Error fetching user data');
    }
}

/**
 * @param {any} userId
 */
async function fetchInvitations(userId) {
    try {
        const usersArray = await readRegistrations();
        const invitations = usersArray.filter((/** @type {{ friendNick: any; }} */ user) => user.friendNick === userId);

        const boats = await readBoats();
        return invitations.filter((/** @type {{ username: any; }} */ invitation) =>
            !boats.some((/** @type {{ nick1: any; nick2: any; }} */ boat) =>
                boat.nick1 === userId ||
                boat.nick2 === userId ||
                boat.nick1 === invitation.username ||
                boat.nick2 === invitation.username
            )
        );
    } catch (err) {
        console.error('Error fetching invitations:', err);
        throw error(500, 'Error fetching invitations');
    }
}

async function fetchBoats() {
    try {
        return await readBoats();
    } catch (err) {
        console.error('Error fetching boats:', err);
        throw error(500, 'Error fetching boats');
    }
}

