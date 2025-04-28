<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores';

    let pets = [];
    let petType: string = '';
    let availableTypes: Set<string> = new Set(); // 🔥 Dinamik type'lar

    async function loadPets() {
        const res = await fetch(`/api/pets${petType ? `?type=${petType}` : ''}`);
        pets = await res.json();

        // 🔥 Gelen petlerin tüm type'larını dinamik olarak topla
        availableTypes = new Set(pets.map(pet => pet.type));
    }

    async function adopt(petId: number) {
        if (!$currentUser || !$currentUser.name) {
            alert('You must be logged in to adopt a pet.');
            return;
        }

        const res = await fetch('/api/adopt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                petId,
                userName: $currentUser.name
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(`Adoption failed: ${data.error}`);
        } else {
            alert('Pet adopted successfully!');
            await loadPets();
        }
    }

    onMount(loadPets);
</script>

<h1>Browse Adoptable Pets</h1>

<div style="margin-bottom: 1rem;">
    <button on:click={() => { petType = ''; loadPets(); }}>All</button>

    {#each Array.from(availableTypes) as type}
        <button on:click={() => { petType = type; loadPets(); }}>
            {type.charAt(0).toUpperCase() + type.slice(1)}s
        </button>
    {/each}
</div>

{#if pets.length === 0}
    <p>No pets available.</p>
{:else}
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        {#each pets as pet}
            <div style="border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
                <h3>{pet.name}</h3>
                <p>Type: {pet.type}</p>
                <p>Status: {pet.adopted ? 'Adopted' : 'Available'}</p>

                {#if !pet.adopted}
                    <button on:click={() => adopt(pet.id)}>Adopt</button>
                {/if}
            </div>
        {/each}
    </div>
{/if}

<style>
</style>
