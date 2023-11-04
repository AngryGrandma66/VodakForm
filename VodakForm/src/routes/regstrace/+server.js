// src/routes/registrace/+server.js

import { error } from '@sveltejs/kit';

// Předstírejme, že máme načtený soubor nebo databázi s registracemi
const registeredNicknames = new Set(['exampleNick1', 'exampleNick2']); // Toto by bylo načteno z databáze

export async function GET({ url }) {
    const nickname = url.searchParams.get('nick');

    if (registeredNicknames.has(nickname)) {
        // Duplicitní přezdívka
        return new Response('Duplicate', { status: 409 });
    } else {
        // Unikátní přezdívka
        return new Response('Unique', { status: 200 });
    }
}
