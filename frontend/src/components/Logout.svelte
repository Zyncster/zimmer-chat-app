<script>
    import pb from '../lib/pocketbase.js';
    export let user;
    export let onLogout;

    function logout() {
        pb.authStore.clear();
        user = null;
        onLogout();
    }
</script>

{#if user}
    <button on:click={logout}>Logout</button>
{/if}

<style>
    button {
        margin-top: 1rem;
        background: #dc3545;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background: #c82333
    }
</style>