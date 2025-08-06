<script>
    import pb from '../lib/pocketbase.js';

    export let user;

    let messages = [];
    let error = '';
    let loading = true;
    let newMessage = '';
    let sending = false;
    let bottomRef;

    async function loadMessages() {
        loading = true;
        error = '';
        try {
        
            const response = await pb.collection('messages').getFullList({
                sort: 'created',
                expand: 'users'
            });
            messages = response;
            console.log('✅ Messages loaded:', response);
        } catch (err) {
            console.error('❌ Error loading messages:', err);
            error = `❌ Failed to load messages: ${err.message}`;
        } finally {
            loading = false;
        }
    }

    async function sendMessage() {
    if (!newMessage.trim()) return;
    sending = true;

    const currentUser = pb.authStore.model;

    if (!currentUser || !currentUser.id) {
        error = '❌ User not authenticated or missing ID.';
        sending = false;
        return;
    }

    console.log("Sending message from user:", currentUser);

    try {
        await pb.collection('messages').create({
            text: newMessage,
            users: currentUser.id
        });
        newMessage = '';
        loadMessages();
    } catch (err) {
        console.error('❌ Failed to send message:', err.response || err);
        error = `❌ Failed to send message: ${err.message}`;
    } finally {
        sending = false;
    }
}

    $: if (messages.length && bottomRef) {
        bottomRef.scrollIntoView({ behavior: 'smooth' });
    }

    $: if (user) {
        loadMessages();
        setupRealtime();
    }

    let unsubscribe = null;

    function setupRealtime () {
        unsubscribe = pb.collection('messages').subscribe('*', async (e) => {
            if (e.action === 'create') {
                if (!e?.record?.id) return;
                
                try {
                    console.log('Fetching message from ID:', e.record.id);
                    const fullMessage = await pb.collection('messages').getOne(e.record.id, {
                        expand: 'users'
                    });

                    messages = [...messages, fullMessage];
                } catch (err) {
                    console.error('Failed to fetch full message:', err);
                }
            }
        });
    }

    import { onDestroy } from 'svelte'

    onDestroy(() => {
        if (unsubscribe) {
            pb.collection('messages').unsubscribe('*')
        }
    });

    function formatTime(timestamp) {
        if (!timestamp || typeof timestamp !== 'string') return '[no time]';
        
        const parsed = Date.parse(timestamp);

        if (isNaN(parsed)) return '[invalid time]';

        return new Date(parsed).toLocaleString('en-US', {
            dateStyle: 'short',
            timeStyle: 'short'
        })
    }
    
</script>

<section class="chat">
    <h2>welcome, {pb.authStore.model.email}</h2>

    {#if loading}
        <p>Loading messages...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        <div class="messages">
            {#each messages as msg}
                <div class="message {msg.expand?.users?.email === pb.authStore.model.email ? 'sent' : 'received'}">
                    <div class="bubble">
                        <div class="meta">
                            <span class ="email">{msg.expand?.users?.email || 'Unknown'}</span>
                            <span class ="timestamp">{formatTime(msg.created)}</span>
                        </div>
                        <p>{msg.text}</p>
                    </div>
                </div>
            {/each}

            <div bind:this={bottomRef}></div>
        </div>
    {/if}

    <form on:submit|preventDefault={sendMessage} class="message-form">
        <input
            type="text"
            bind:value={newMessage}
            placeholder="Type a message..."
            required
        />
        <button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? 'Sending...' : 'Send'}
        </button>
    </form>
</section>

<style>
    .chat {
        max-width: 600px;
        margin: 0 auto;
        padding: 1rem;
        border-radius: 8px;
        background-color: #1e1e1e;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    }

    .messages {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        overflow-y: auto;
        height: 60vh;
        scroll-behavior: smooth;
    }
    .message {
        display: flex;
    }

    .message.sent {
        justify-content: flex-end;
    }

    .message.received {
        justify-content: flex-start;
    }

    .bubble {
        max-width: 70%;
        padding: 0.75rem 1rem;
        border-radius: 16px;
        background-color: #e0e0e0;
        color: #111;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }
    
    .message.sent .bubble {
        background-color: #2d89ed;
        color: white;
    }

    .meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        margin-bottom: 0.25rem;
        opacity: 0.8;
    }

    .email {
        font-weight: bold;
    }

    .timestamp {
        font-style: italic;
    }

    .error {
        color: red;
    }

    .message-form {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .message-form input {
        flex: 1;
        padding: 0.5rem;
        border: 1 px solid #ccc;
        border-radius: 5px;
    }

    .message-form button {
        padding: 0.5rem 1rem;
        border: none;
        background: #2d89ed;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    }

    .message-form button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>