<script>
   import {loginPassword, loginUsername} from '../../stores.js'
   import {validateUsername, validatePassword} from "../../utils/validation.js";
   import { logSubmitForm } from '../../utils/logFormHandlers.js';

</script>

<main>
    <h1>Přihlašení</h1>
    <form on:submit|preventDefault={logSubmitForm}>
    <label for="username">Přezdívka:</label>
    <input type="text"
           id="username"
           name="username"
           bind:value={$loginUsername}
           class:valid={validateUsername($loginUsername) }
           class:invalid={!validateUsername($loginUsername)&& $loginUsername!==''}
           required
           maxlength="20">

    <label for="password">Heslo:</label>
    <input type="password"
           id="password"
           name="password"
           bind:value={$loginPassword}
           class:valid={validatePassword($loginPassword) }
           class:invalid={!validatePassword($loginPassword) && $loginPassword!==''}
           maxlength="64"
           minlength="8"
           required>
    <button type="submit">Odeslat</button>
    <button type="button" on:click={() => window.location.href = '/'}>Storno</button>
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
