import { get } from 'svelte/store';
import {loginPassword,loginUsername} from '../stores.js'

async function submitData(formData) {
    try {
        const response = await fetch('/login/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        return await response.json(); // or handle the response as needed
    } catch (error) {
        console.error('Submission error:', error);
        alert('Došlo k chybě.');
    }
}

// Adjusted function to handle the form submission
export async function logSubmitForm() {
    const currentLoginUsername= get(loginUsername)
    const currentLoginPassword= get(loginPassword)
    // Construct the form data object
    const formData = {
        loginUsername: currentLoginUsername.trim().toLowerCase(),
        loginPassword: currentLoginPassword
    };
    // Submit the form data
    const result = await submitData(formData);

    if (result?.success) {
        alert('Login byl úspěšný');
        // Optionally reset the form or redirect the user
        window.location.href = '/'
    } else {
        alert('Jméno nebo heslo není správně');
    }
}


