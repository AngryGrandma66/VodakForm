<script>
    import { username, isSwimmer, friendNick, sClass, usernameUnique,emailUnique, email, password, confPassword } from '../../stores.js'
    import { validatePassword, validateUsername, validateEmail, validateSClass } from "../../utils/validation.js"
    import { checkEmailUniqueness, checkUsernameUniqueness, regSubmitForm } from '../../utils/regFormHandlers.js';
    import { onMount } from 'svelte';
    import {get} from "svelte/store";


    onMount(() => {
        // Debounce the uniqueness check to avoid too many API calls
        /**
		 * @type {number | undefined}
		 */
        let timeout;

        function debouncedCheck() {
            clearTimeout(timeout);
            timeout = setTimeout(() => checkUsernameUniqueness(get(username)), 500);
        }
        /**
         * @type {number | undefined}
         */
        let emailTimeout;
        function debouncedEmailCheck() {
            clearTimeout(emailTimeout);
            emailTimeout = setTimeout(() => checkEmailUniqueness(get(email)), 500);
        }

        return () => {
            debouncedCheck();
            debouncedEmailCheck();
        };
    });


</script>
<main>
    <h1>Registrace na vodácký kurz</h1>
    <form on:submit|preventDefault={regSubmitForm}>

        <label for="username">Přezdívka:</label>
        <input type="text"
               id="username"
               name="username"
               bind:value={$username}
               on:input={() => checkUsernameUniqueness($username)}
               class:valid={$usernameUnique && $username!==$friendNick }
               class:invalid={!$usernameUnique||($username===$friendNick && $username!=='')}
               required
               maxlength="20">

        <label for="isSwimmer">Plavecké dovednosti:</label>
        <select id="isSwimmer" name="je_plavec" bind:value={$isSwimmer} required>
            <option value="" disabled selected>Vyberte možnost</option>
            <option value="1">Ano</option>
            <option value="0">Ne</option>
        </select>

        <label for="sClass">Třída:</label>
        <input type="text"
               id="sClass"
               name="sClass"
               bind:value={$sClass}
               class:valid={$sClass!==''&&validateSClass($sClass)}
               class:invalid={$sClass!==''&&!validateSClass($sClass)}
               required
               pattern="^[aceACE][1234][abcABC]$"
               maxlength="3">

        <label for="email">email:</label>
        <input type="text"
               id="email"
               name="email"
               bind:value={$email}
               on:input={() => checkEmailUniqueness($email)}
               class:valid={$emailUnique &&validateEmail($email)}
               class:invalid={(!$emailUnique || !validateEmail($email))&& $email!==''}
               required
               maxlength="320">

        <label for="friendNick">Kamarád na lodi (nepovinné):</label>
        <input type="text"
               id="friendNick"
               name="kanoe_kamarad"
               bind:value={$friendNick}
               class:valid={validateUsername($friendNick) || $friendNick === ''}
               class:invalid={(!validateUsername($friendNick) ||$username===$friendNick) && $friendNick!==''}
               maxlength="20">

        <label for="password">Heslo:</label>
        <input type="password"
               id="password"
               name="password"
               bind:value={$password}
               class:valid={validatePassword($password) && ($confPassword===$password ||$confPassword==='')  }
               class:invalid={(!validatePassword($password) ||($confPassword!==$password&&$confPassword!=='')) && $password!==''}
               maxlength="64"
               minlength="8"
               required>

        <label for="confPassword">Podtvrzení hesla:</label>
        <input type="password"
               id="confPassword"
               name="confPassword"
               bind:value={$confPassword}
               class:valid={validatePassword($confPassword) && $confPassword===$password }
               class:invalid={(!validatePassword($confPassword) ||$confPassword!==$password) && $confPassword!==''}
               maxlength="64"
               minlength="8"
               required>

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
