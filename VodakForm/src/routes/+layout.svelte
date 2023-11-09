<script>

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
            window.location.href = '/login';            }
        else{
            console.log(data.props.userId);
            window.location.href = `/user/${data.props.userId}`;
        }
    }
</script>


<nav>
    <a href="/">Home</a>
    <a href="/registrace">Registrovat se</a>
    <a href="/login">Přihlásit se</a>
    <button on:click={handleLogout}>Odhlásit se</button>
    <button on:click={redirectToBoats}>Loďe</button>
</nav>

<slot></slot>