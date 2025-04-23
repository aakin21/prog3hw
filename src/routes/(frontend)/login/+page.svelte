<script lang="ts">
    import { goto } from '$app/navigation';
    import { currentUser } from '$lib/stores';
    let error = '';
    let name = '';
    let password = '';

    async function handleLogin() {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password })
        });

        if (res.ok) {
            const user = await res.json();
            currentUser.set(user);
            goto('/dashboard');
        } else {
            const err = await res.json();
            error = err.error || 'Login failed';
        }
    }
</script>

<h1>Login</h1>

{#if error}<p style="color: red;">{error}</p>{/if}

<form on:submit|preventDefault={handleLogin}>
    <label>
        Name:
        <input type="text" bind:value={name} required />
    </label>
    <br />
    <label>
        Password:
        <input type="password" bind:value={password} required />
    </label>
    <br />
    <button type="submit">Log In</button>
</form>
