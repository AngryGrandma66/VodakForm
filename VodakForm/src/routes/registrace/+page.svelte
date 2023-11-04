
<script>
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    let nick = '';
    let isSwimmer = '';
    let friendNick = '';
    let nickUnique = true; // Assume nickname is not unique initially

    // Function to validate the nickname
    function validateNickname(nickname) {
        const regex = /^[a-zA-Z0-9]{2,20}$/;
        return regex.test(nickname);
    }

    // Function to check the nickname's uniqueness via an API call
    async function checkNicknameUniqueness(nickname) {
        if (!validateNickname(nickname)) {
            nickUnique = false;
            return;
        }
        try {
            const response = await fetch(`/registrace/nickname-check?nick=${encodeURIComponent(nickname)}`);
            nickUnique = response.ok; // If the status is 200, the nickname is unique
        } catch (error) {
            console.error('Error checking nickname uniqueness', error);
        }
    }

    // Only run the AJAX call if we are in the browser
    if (browser) {
        onMount(() => {
            // Debounce the uniqueness check to avoid too many API calls
            let timeout;
            function debouncedCheck() {
                clearTimeout(timeout);
                timeout = setTimeout(() => checkNicknameUniqueness(nick), 500);
            }
            return debouncedCheck;
        });
    }

    // Function to handle the form submission
    async function submitData(formData) {
        try {
            const response = await fetch('/registrace/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            return await response.json(); // or handle the response as needed
        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting the form.');
        }
    }

    // Adjusted function to handle the form submission
    async function submitForm() {
        if (!validateNickname(nick)||!(validateNickname(friendNick)||friendNick==="")){
            alert('Vstupní udáje nejsou validní');
            return false;

        }

        if (!nickUnique) {
            alert('Přezdívku už nekdo má.');
            return false;
        }


        if(!isSwimmer) {
            alert('Musíte umět plavat');
            return false;
        }
            // Construct the form data object
        const formData = {
            nick,
            isSwimmer,
            friendNick: friendNick || null  // Optional field
        };

        // Submit the form data
        const result = await submitData(formData);
        if (result && result.success) {
            alert('Registrace Úspěšná');
            // Optionally reset the form or redirect the user
            window.history.back()
        } else {
            alert('Registration failed. Please try again.');
        }

        // Proceed with form submission logic...
    }
</script>

<main>
    <h1>Registrace na vodácký kurz</h1>
    <form on:submit|preventDefault={submitForm}>
        <label for="nick">Přezdívka:</label>
        <input type="text"
               id="nick"
               name="nick"
               bind:value={nick}
               on:input={() => checkNicknameUniqueness(nick)}
               class:valid={nickUnique && nick !== ''}
               class:invalid={!nickUnique && nick !== ''}
               required>

        <label for="isSwimmer">Plavecké dovednosti:</label>
        <select id="isSwimmer" name="je_plavec" bind:value={isSwimmer} required>
            <option value="" disabled selected>Vyberte možnost</option>
            <option value="1">Ano</option>
            <option value="0">Ne</option>
        </select>

        <label for="friendNick">Kamarád na lodi (nepovinné):</label>
        <input type="text" id="friendNick" name="kanoe_kamarad" bind:value={friendNick} class:valid={validateNickname(friendNick) || friendNick === ''} class:invalid={!validateNickname(friendNick) && friendNick !== ''}>

        <button type="submit">Odeslat</button>
        <button type="button" on:click={() => window.history.back()}>Storno</button>
    </form>
</main>

<style>
    .valid {
        border-color: green;
    }
    .invalid {
        border-color: red;
    }
</style>
