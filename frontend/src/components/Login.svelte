<script>
    import pb from '../lib/pocketbase.js';

    export let user;

    let email = '';
    let password = '';
    let error = '';

    async function register() {
        error = '';
        try {
            await pb.collection('users').create({
                email,
                password,
                passwordConfirm: password,
                emailVisibility: true
            });
            await login();
        } catch (err) {
            error = err.message;
        }
    }

    async function login() {
        error = '';
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);

            document.cookie = pb.authStore.exportToCookie({ httpOnly: false });

            user = authData.record;
            document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
        } catch (err) {
            error = err.message;
        }
    }

    console.log('pb is:', pb);
</script>

{#if !user}
  <form on:submit|preventDefault={login}>
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Login</button>
    <button type="button" on:click={register}>Register</button>
  </form>
{:else}
  <p>✅ Logged in as {user.email}</p>
{/if}

{#if error}
  <p style="color: red;">{error}</p>
{/if}


