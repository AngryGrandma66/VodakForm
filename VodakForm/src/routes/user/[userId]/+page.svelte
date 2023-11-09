<script>

    export let data;

    /**
	 * @param {any} friendNick
	 */
    async function acceptInvitation(friendNick) {
        try {
            const response = await fetch(`./${data.props.userData.username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friendNick })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    console.log('Invitation accepted');
                    window.location.reload();
                } else {
                    console.error('Failed to accept invitation');
                }
            } else {
                console.error('Failed to send request');
            }
        } catch (error) {
            console.error('Error accepting invitation:', error);
        }
    }


</script>

{#if data.props.userData.username}
    <div>
        <h1>Vítej, {data.props.userData.username}!</h1>

        <h2>Lodě</h2>
        <ul>
            {#each data.props.boats as boat}
                <li class="boat">{boat.nick1} & {boat.nick2}</li>
            {/each}
        </ul>

        <h2>Vaše pozvánky</h2>
        <ul>
            {#each data.props.invitations as invitation}
                <li class="invitation">
                    {invitation.username} vás pozval na loď.
                    <button on:click={() => acceptInvitation(invitation.username)}>Přijmout Pozvánku</button>
                </li>
            {/each}
        </ul>
        <button type="button" on:click={() => window.history.back()}>Storno</button>
    </div>
{:else}
    <p class="loading">Načítání uživatelských dat...</p>
{/if}

<style>/* Center the main content */
div {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

/* Style headings for clarity */
h1 {
    color: #4a90e2;
    margin-bottom: 0.5em;
}

h2 {
    color: #333;
    font-size: 1.5em;
    margin-top: 1em;
    margin-bottom: 0.5em;
}

/* Style for boats and invitations lists */
ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

li {
    background-color: #f7f7f7;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
}

button {
    background-color: #4a90e2;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 10px;
}

button:hover {
    background-color: #357ab8;
}

/* Additional styles for visual clarity */
.invitation {
    background-color: #eaf1f7;
    border-left: 5px solid #4a90e2;
    padding-left: 15px;
}

.boat {
    background-color: #e7eaf3;
    border-left: 5px solid #6a7fcb;
    padding-left: 15px;
}

/* Style for the 'Storno' button */
button[type="button"] {
    background-color: #ff6b6b;
}

button[type="button"]:hover {
    background-color: #ff5252;
}

/* Add a loading animation for loading state */
.loading {
    font-size: 1.2em;
    color: #666;
    text-align: center;
    animation: blinker 1.5s linear infinite;
}

@keyframes blinker {
    50% {
        opacity: 0;
    }
}
</style>