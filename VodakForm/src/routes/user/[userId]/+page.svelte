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
        <h1>Welcome, {data.props.userData.username}!</h1>
        <h2>Boats</h2>
        <ul>
            {#each data.props.boats as boat}
                <li>{boat.nick1} & {boat.nick2}</li>
            {/each}
        </ul>

        <h2>Your Invitations</h2>
        <ul>
            {#each data.props.invitations as invitation}
                <li>
                    {invitation.username} has invited you to join a boat.
                    <button on:click={() => acceptInvitation(invitation.username)}>Accept Invitation</button>
                </li>
            {/each}
        </ul>
        <button type="button" on:click={() => window.history.back()}>Storno</button>

    </div>
{:else}
    <p>Loading user data...</p>
{/if}
