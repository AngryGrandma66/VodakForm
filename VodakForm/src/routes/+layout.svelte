<script>
    import { goto } from '$app/navigation';
    export let data;

    async function handleLogout() {
        const response = await fetch('/logout', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            console.error('Logout failed');
        }
    }
    async function redirectToBoats(){
        if (data.props.userId===null){
           await goto('/login');
        }
        else{
            console.log(data.props.userId);
            await goto(`/user/${data.props.userId}`);
        }
    }
</script>


<nav>
    <a href="/">Home</a>
    {#if data.props.userId===null}
    <a href="/registrace">Registrovat se</a>
    <a href="/login">Přihlásit se</a>
    {:else}
    <button on:click={handleLogout}>Odhlásit se</button>
    <button on:click={redirectToBoats}>Loďe</button>
    {/if}
</nav>

<slot></slot>