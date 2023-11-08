import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

// Path to the JSON file
const dataFilePath = path.resolve('data/registrace.json');

// Function to read registrations from the JSON file
export async function readRegistrations() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // @ts-ignore
        if (err.code === 'ENOENT') {
            // If the file does not exist, return an empty array
            await fs.writeFile(dataFilePath, JSON.stringify([]));
            return [];
        } else {
            throw error(500, 'Error reading registrations');
        }
    }
}

// Function to check if a username is unique
/**
 * @param {any} username
 */
async function isUsernameUnique(username) {
    const registrations = await readRegistrations();
    return !registrations.some((/** @type {{ username: any; }} */ reg) => reg.username === username);
}

// Endpoint to check the username uniqueness
export async function GET({ url }) {
    const username = url.searchParams.get('username');
    if (!username) {
        return new Response(null, { status: 400 });
    }
    const unique = await isUsernameUnique(username);
    return new Response(unique ? 'Unique' : 'Duplicate', { status: unique ? 200 : 409 });
}
