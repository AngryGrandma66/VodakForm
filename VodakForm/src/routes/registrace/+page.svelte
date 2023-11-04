
<script>
    import { onMount } from 'svelte';
    let nickname = '';
    let isUnique = true;

    async function checkNickname() {
        if (!nickname) {
            isUnique = true; // No need to check if nickname is empty
            return;
        }

        // Call the server to check if the nickname is unique
        const response = await fetch(`/registrace/nick-check?nick=${encodeURIComponent(nickname)}`);
        isUnique = response.ok; // if the response is ok, then the nickname is unique
    }

    onMount(() => {
        // Perform any on mount actions if necessary
    });
</script>

<form on:submit|preventDefault="{checkNickname}">
    <label for="nick">Přezdívka:</label>
    <input
            type="text"
            id="nick"
            name="nick"
            bind:value="{nickname}"
            on:input="{checkNickname}"
            class="{isUnique ? '' : 'is-invalid'}"
    >
    <span class="invalid-feedback" style="{isUnique ? 'display: none;' : ''}">
    This nickname is already taken.
  </span>
    <button type="submit">Register</button>
</form>

<style>
    .is-invalid {
        border-color: #dc3545;
    }
    .invalid-feedback {
        color: #dc3545;
    }
</style>
