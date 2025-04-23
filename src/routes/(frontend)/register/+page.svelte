<script lang="ts">
    import { goto } from '$app/navigation';
    import { currentUser } from '$lib/stores';

    let name = '';
    let password = '';
    let confirm = '';
    let error = '';

    async function handleRegister() {
        // NOTE: you have to confirm the password
        // NOTE: if the registration is successful sign-in the user automatically and redirect them to /dashboard

        if (password !== confirm) {
            error = 'Passwords do not match';
            return;
        }

        const res = await fetch('/api/auth/register', {
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
            error = err.error || 'Registration failed';
        }
    }
</script>

<h1>Register</h1>

{#if error}
    <p style="color: red;">{error}</p>
{/if}

<form on:submit|preventDefault={handleRegister}>
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
    <label>
        Confirm Password:
        <input type="password" bind:value={confirm} required />
    </label>
    <br />
    <button type="submit">Register</button>
</form>
