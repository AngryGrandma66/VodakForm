// place files you want to import through the `$lib` alias in this folder.
import fs from 'fs/promises';
import path from 'path';

// Path to the JSON file
const dataFilePath = path.resolve('registrace.json');

async function read_registrations() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // The file does not exist, return an empty array
            return [];
        } else {
            // Re-throw the error to be handled by the caller
            throw err;
        }
    }
}

async function write_registration(nickname) {
    const registrations = await read_registrations();
    if (registrations.includes(nickname)) {
        // The nickname is already registered
        return false;
    }
    registrations.push(nickname);
    await fs.writeFile(dataFilePath, JSON.stringify(registrations, null, 2), 'utf8');
    return true;
}

export { read_registrations, write_registration };