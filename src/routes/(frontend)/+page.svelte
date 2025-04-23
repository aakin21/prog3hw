<script lang="ts">
    import { onMount } from 'svelte';

    let pets = [];
    let petType: '' | 'puppy' | 'kitten' = '';

    async function loadPets() {
        const res = await fetch(`/api/pets${petType ? `?type=${petType}` : ''}`);
        pets = await res.json();
    }

    async function adopt(petId: number) {
        const userName = 'demoUser'; // TODO: replace with current session user

        const res = await fetch('/api/adopt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ petId, userName })
        });

        if (res.ok) {
            await loadPets();
        } else {
            const error = await res.json();
            alert(`Adoption failed: ${error.error}`);
        }
    }

    onMount(loadPets);
</script>

<h1>Browse Adoptable Pets</h1>

<div style="margin-bottom: 1rem;">
    <button on:click={() => { petType = ''; loadPets(); }}>All</button>
    <button on:click={() => { petType = 'puppy'; loadPets(); }}>Puppies</button>
    <button on:click={() => { petType = 'kitten'; loadPets(); }}>Kittens</button>
</div>

{#if pets.length === 0}
    <p>No pets available.</p>
{:else}
    <!--    show available pets here-->
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
