import {error} from '@sveltejs/kit';
import {validateSession} from '$lib/sessionStore';
import {boatsFilePath, readBoats, readRegistrations} from '$lib/fileRead.js';
import fs from "fs/promises";

/**
 * @param {{ nick1: any; nick2: any; }} newBoat
 */
async function createBoat(newBoat) {
    try {
        const boats = await readBoats();
        boats.push(newBoat);
        await fs.writeFile(boatsFilePath, JSON.stringify(boats, null, 2));
        return { success: true };
    } catch (err) {
        console.error('Error in adding boats:', err);
        throw new Error('Error in adding boats'); // Throw a new Error object
    }
}

/**
 * @param {any} userId
 * @param {any} friendNick
 */
async function acceptInvitation(userId, friendNick) {
    const registrations = await readRegistrations();
    const currentUser = registrations.find((/** @type {{ username: any; }} */ reg) => reg.username === userId);
    const friend = registrations.find((/** @type {{ username: any; }} */ reg) => reg.username === friendNick);

    if (!currentUser || !friend) {
        throw new Error('User or friend not found'); // Throw an error if a user is not found
    }

    const newBoat = {
        nick1: currentUser.username,
        nick2: friend.username
    };

    return await createBoat(newBoat);
}

export async function POST({ request, locals }) {
    // Authenticate the user
    // @ts-ignore
    const session = locals.user;
    if (!session || !validateSession(session)) {
        throw error(401, 'Not authenticated');
    }

    try {
        // Get the JSON data from the request
        const requestData = await request.json(); // Use .json() instead of .formData()
        const friendNick = requestData.friendNick;

        const result = await acceptInvitation(session.userId, friendNick);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('Error accepting invitation:', err);
        // @ts-ignore
        return new Response(JSON.stringify({ success: false, message: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}