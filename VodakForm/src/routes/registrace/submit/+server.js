import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import argon2 from "argon2";
import {dataFilePath, readRegistrations} from "$lib/fileRead.js";


/**
 * @param {{ username: string; isSwimmer: string; sClass: string; email: string; password: string | Buffer; friendNick: string | null; // Optional field
 *  }}  newRegistration
 *  */
async function updateRegistrations(newRegistration) {

    try{
        newRegistration.username = newRegistration.username.toLowerCase().trim()
        newRegistration.sClass = newRegistration.sClass.toLowerCase()
        newRegistration.email = newRegistration.email.trim().toLowerCase()
        newRegistration.password = await argon2.hash(newRegistration.password)
        newRegistration.friendNick=newRegistration.friendNick!==null?newRegistration.friendNick.toLowerCase().trim():null

        const registrations =await readRegistrations()
        registrations.push(newRegistration);
        await fs.writeFile(dataFilePath, JSON.stringify(registrations, null, 2));
        return { success: true };
    } catch (err) {

        console.error('Error processing registration:', err);
        throw error(500, 'Error processing registration');
    }

}
export async function POST({ request }) {
    try {
        const formData = await request.json();
        const result = await updateRegistrations(formData);
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (err) {
        console.error('Server error during POST:', err);
        // @ts-ignore
        return new Response(JSON.stringify({ success: false, message: err.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }

        });

    }

}
