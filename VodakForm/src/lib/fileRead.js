import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

export const dataFilePath = path.resolve('data/registrace.json');

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