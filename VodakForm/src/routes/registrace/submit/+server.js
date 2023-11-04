import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';



// Function to read and write registrations

async function updateRegistrations(newRegistration) {

    const dataFilePath = path.resolve('data/registrace.json');
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        const registrations = JSON.parse(data);
        registrations.push(newRegistration);
        await fs.writeFile(dataFilePath, JSON.stringify(registrations, null, 2));
        return { success: true };
    } catch (err) {

        console.error('Error processing registration:', err);
        throw error(500, 'Error processing registration');
    }

}



// Endpoint to handle the form submission

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
        return new Response(JSON.stringify({ success: false, message: err.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }

        });

    }

}