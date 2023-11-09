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
    <button on:click={() =>goto('/')}>Home</button>
    {#if data.props.userId===null}
        <button on:click={() =>goto('/registrace')}>Registrovat se</button>
        <button on:click={() =>goto('/login')}>Přihlásit se</button>
    {:else}
    <button on:click={handleLogout}>Odhlásit se</button>
    <button on:click={redirectToBoats}>Loďe</button>
    {/if}
</nav>

<slot></slot>