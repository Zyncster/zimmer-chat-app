<script>
    import Login from './Login.svelte';
    import Chat from './Chat.svelte';
    import Logout from './Logout.svelte';
    import pb from '../lib/pocketbase.js';

    let user = pb.authStore.isValid ? pb.authStore.model : null;


    function handleLogout() {
        user = null;
    }
</script>

<main>
    <h1>ZepChat</h1>

    {#if user}
        <Logout {user} onLogout={handleLogout} />
        <Chat {user} />
    {:else}
        <Login on:login={e => user = e.detail} />
    {/if}
</main>