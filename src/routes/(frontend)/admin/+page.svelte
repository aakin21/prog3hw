<script lang="ts">
    import { currentUser } from '$lib/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let name = '';
    let selectedType = '';
    let customType = '';
    let hunger = 50;
    let happiness = 50;
    let error = '';
    let success = '';
    let availableTypes: Set<string> = new Set();

    $: user = $currentUser;

    onMount(async () => {
        if (!user) {
            goto('/login');
        } else if (user.role !== 'admin') {
            goto('/');
        } else {
            await loadAvailableTypes();
        }
    });

    async function loadAvailableTypes() {
        try {
            const res = await fetch('/api/pets');
            if (res.ok) {
                const pets = await res.json();
                availableTypes = new Set(pets.map((pet: any) => pet.type));
            } else {
                console.error('Failed to load pets for types');
            }
        } catch (error) {
            console.error('Error loading types', error);
        }
    }

    async function addPet() {
        const typeToSend = selectedType === 'other' ? customType : selectedType;

        if (!typeToSend) {
            error = 'Please select or enter a type.';
            return;
        }

        const res = await fetch('/api/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type: typeToSend, hunger, happiness })
        });

        if (res.ok) {
            success = 'Pet added!';
            error = '';
            name = '';
            selectedType = '';
            customType = '';
            hunger = 50;
            happiness = 50;
            await loadAvailableTypes(); 
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
        <select bind:value={selectedType} required>
            <option value="" disabled selected>Select type</option>
            {#each Array.from(availableTypes) as type}
                <option value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            {/each}
            <option value="other">Other</option>
        </select>
    </label>

    {#if selectedType === 'other'}
        <label>
            Custom Type:
            <input type="text" bind:value={customType} placeholder="Enter custom type" required />
        </label>
    {/if}

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
