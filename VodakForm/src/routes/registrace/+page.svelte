<script>
    import { username, isSwimmer, friendNick, sClass, usernameUnique,emailUnique, email, password, confPassword } from '../../stores.js'
    import { validatePassword, validateUsername, validateEmail, validateSClass } from "../../utils/validation.js"
    import { checkEmailUniqueness, checkUsernameUniqueness, regSubmitForm } from '../../utils/regFormHandlers.js';
    import { onMount } from 'svelte';
    import {get} from "svelte/store";


    onMount(() => {
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
        <span class="guide-text">Přezdívka by měla být dlouhá 2-20 znaků a může obsahovat pouze písmena a čísla.</span>
        <input type="text"
               id="username"
               name="username"
               bind:value={$username}
               on:input={() => checkUsernameUniqueness($username)}
               class:valid={$usernameUnique && $username!==$friendNick && validateUsername($username)}
               class:invalid={((!$usernameUnique||!validateUsername($username))||$username===$friendNick)&& $username!=='' }
               required
               maxlength="20">

        <label for="isSwimmer">Plavecké dovednosti:</label>
        <select id="isSwimmer" name="je_plavec" bind:value={$isSwimmer} required>
            <option value="" disabled selected>Vyberte možnost</option>
            <option value="true">Ano</option>
            <option value=''>Ne</option>
        </select>

        <label for="sClass">Třída:</label>
        <span class="guide-text">Třída by měla být ve formátu písmene (A, C nebo E), následovaného číslem (1-4) a dalším písmenem (A, B nebo C), například 'A1a'.</span>
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
        <span class="guide-text">Email by měl být platnou e-mailovou adresou, přičemž doménová část může být dlouhá až 255 znaků.</span>
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
        <span class="guide-text">Kamarád na lodi by měl splňovat stejné podmínky jako řezdívka</span>
        <input type="text"
               id="friendNick"
               name="kanoe_kamarad"
               bind:value={$friendNick}
               class:valid={validateUsername($friendNick) || $friendNick === ''}
               class:invalid={(!validateUsername($friendNick) ||$username===$friendNick) && $friendNick!==''}
               maxlength="20">

        <label for="password">Heslo:</label>
        <span class="guide-text">Heslo musí mít alespoň 8 znaků, včetně jednoho čísla, jednoho velkého písmene, jednoho malého písmene a jednoho speciálního znaku.</span>
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
