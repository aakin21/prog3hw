<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores';
    import type { Pet } from '$lib/types';
    import { goto } from '$app/navigation';

    let pets: Pet[] = [];
    let error = '';
    let success = '';

    $: user = $currentUser;

    async function loadPets() {
        if (!user) return;

        const res = await fetch(`/api/adopt?name=${user.name}`);
        if (res.ok) {
            pets = await res.json();
        } else {
            error = 'Failed to load pets';
        }
    }

    async function handleAction(petId: number, action: 'feed' | 'toy' | 'return') {
        console.log(`clicked action: ${action} - petId: ${petId}`);
        if (!user) return;

        const res = await fetch('/api/actions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: user.name,
                petId,
                action
            })
        });

        if (res.ok) {
            const result = await res.json();
            success = `${action} action successful`;
            error = '';
            user.inventory = result.user.inventory;
            user.budget = result.user.budget;
            await loadPets();
        } else {
            const err = await res.json();
            error = err.error || 'Action failed';
            success = '';

            // 🔥 Inventory yoksa shop sayfasına otomatik yönlendir
            if (error.includes('No food') || error.includes('No toy')) {
                goto('/shop');
            }
        }
    }

    onMount(() => {
        if (!user) {
            goto('/login');
        } else {
            loadPets();
        }
    });
</script>

<h1>📋 Your Adopted Pets</h1>

{#if success}<p style="color: green;">{success}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

{#if pets.length === 0}
    <p>You haven’t adopted any pets yet.</p>
{:else}
    <!-- Inventory Display -->
    <p>
        Inventory:
        Food: {user?.inventory?.food ?? 0},
        Toys: {user?.inventory?.toy ?? 0},
        Treats: {user?.inventory?.treat ?? 0}
    </p>

    <!-- Show your pets here -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        {#each pets as pet}
            <div style="border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
                <h3>{pet.name}</h3>
                <p>Hunger: {pet.hunger}</p>
                <p>Happiness: {pet.happiness}</p>
                <button
                        on:click={() => handleAction(pet.id, 'feed')}
                        disabled={pet.hunger === 0}>
                    Feed (-$5)
                </button>
                <button on:click={() => handleAction(pet.id, 'toy')}>Play (-$10)</button>
                <button on:click={() => handleAction(pet.id, 'return')}>Return (-$20)</button>
            </div>
        {/each}
    </div>
{/if}

<style>
</style>
