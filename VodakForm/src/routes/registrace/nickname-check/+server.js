import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

// Path to the JSON file
const dataFilePath = path.resolve('data/registrace.json');

// Function to read registrations from the JSON file
async function readRegistrations() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // If the file does not exist, return an empty array
            await fs.writeFile(dataFilePath, JSON.stringify([]));
            return [];
        } else {
            throw error(500, 'Error reading registrations');
        }
    }
}

// Function to check if a nickname is unique
async function isNicknameUnique(nickname) {
    const registrations = await readRegistrations();
    return !registrations.some(reg => reg.nick === nickname);
}

// Endpoint to check the nickname uniqueness
export async function GET({ url }) {
    const nickname = url.searchParams.get('nick');
    if (!nickname) {
        return new Response(null, { status: 400 });
    }
    const unique = await isNicknameUnique(nickname);
    return new Response(unique ? 'Unique' : 'Duplicate', { status: unique ? 200 : 409 });
}
