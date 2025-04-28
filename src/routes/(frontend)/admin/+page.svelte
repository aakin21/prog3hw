<script lang="ts">
    import { currentUser } from '$lib/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let name = '';
    let type = '';
    let hunger = 50;
    let happiness = 50;
    let error = '';
    let success = '';

    $: user = $currentUser;

    onMount(() => {
        if (!user) {
            goto('/login');
        } else if (user.role !== 'admin') {
            goto('/');
        }
    });

    async function addPet() {
        const res = await fetch('/api/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type, hunger, happiness })
        });

        if (res.ok) {
            success = 'Pet added!';
            error = '';
            name = '';
            type = '';
            hunger = 50;
            happiness = 50;
        } else {
            const err = await res.json();
            error = err.error || 'Failed to add pet';
            success = '';
        }
    }
</script>

<h1>Add a New Pet</h1>

{#if success}<p style="color: green;">{success}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

<form on:submit|preventDefault={addPet}>
    <label>
        Name:
        <input type="text" bind:value={name} required />
    </label>

    <label>
        Type:
        <input type="text" bind:value={type} required />
    </label>

    <label>
        Hunger:
        <input type="number" bind:value={hunger} min="0" max="100" />
    </label>

    <label>
        Happiness:
        <input type="number" bind:value={happiness} min="0" max="100" />
    </label>

    <button type="submit">Add Pet</button>
</form>

<style>
    form {
        display: grid;
        gap: 0.75rem;
        max-width: 300px;
    }
</style>
