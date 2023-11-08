<script>
    async function handleLogout() {
        // Make a GET request to the logout endpoint
        const response = await fetch('/logout', {
            method: 'GET',
            credentials: 'include' // Needed to include cookies
        });

        if (response.ok) {
            // Handle successful logout, e.g., navigate to home page
            window.location.href = '/';
        } else {
            // Handle errors, e.g., show an error message
            console.error('Logout failed');
        }
    }</script>

<main>
    <h1>Rozsazení v lodích na vodáckém kurzu 2023 SPŠE Ječná</h1>
    <a href="/registrace">Registrovat se</a>
    <a href="/login">Přihlásit se</a>

    <button on:click={handleLogout}>Odhlásit se</button></main>

<style>
    /* zde můžete přidat styly, pokud je to potřeba */
</style>
