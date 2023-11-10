import { get } from 'svelte/store';
import {loginPassword,loginUsername} from '../stores.js'

/**
 * @param {{ loginUsername: string; loginPassword: string; }} formData
 */
async function submitData(formData) {
    try {
        const response = await fetch('/login/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        return await response.json(); 
    } catch (error) {
        console.error('Submission error:', error);
        alert('Došlo k chybě.');
    }
}

export async function logSubmitForm() {
    const currentLoginUsername= get(loginUsername)
    const currentLoginPassword= get(loginPassword)
    const formData = {
        loginUsername: currentLoginUsername.trim().toLowerCase(),
        loginPassword: currentLoginPassword
    };
    const result = await submitData(formData);

    if (result?.success) {
        alert('Login byl úspěšný');
        window.location.href = '/'
    } else {
        alert('Jméno nebo heslo není správně');
    }
}


