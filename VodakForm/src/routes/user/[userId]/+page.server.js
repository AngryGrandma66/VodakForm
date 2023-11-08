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

    // Fetch user-specific data and available boat invitations
    const userData = await fetchUserData(session.userId);
    const boats = await fetchBoats();

    // Find invitations for the user
    const invitations = await fetchInvitations(session.userId)

    // Return user data and boats to the page
    return {
        props: {
            userData, boats, invitations
        }
    };
}

function parseCookie(cookieHeader, name) {
    const value = `; ${cookieHeader}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function fetchUserData(userId) {
    try {
        const usersArray = await readRegistrations();
        return usersArray.find(user => user.username === userId)
    } catch (err) {
        console.error('Error fetching user data:', err);
        throw error(500, 'Error fetching user data');
    }
}

async function fetchInvitations(userId) {
    try {
        const usersArray = await readRegistrations();
        const invitations = usersArray.filter(user => user.friendNick === userId);

        // Exclude any invitations where a boat already exists.
        const boats = await readBoats();
        return invitations.filter(invitation => !boats.some(boat => (boat.nick1 === invitation.username && boat.nick2 === userId) || (boat.nick2 === invitation.username && boat.nick1 === userId)));
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

