<script lang="ts">
    import { currentUser } from '$lib/stores';

    $: user = $currentUser;
    let error = '';
    let success = '';

    async function buy(item: 'food' | 'toy' | 'treat') {
        if (!user) return;

        const res = await fetch('/api/shop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: user.name, item })
        });

        const result = await res.json();

        if (res.ok) {
            success = result.message;
            error = '';
            user.inventory = result.user.inventory;
            user.budget = result.user.budget;
        } else {
            error = result.error || 'Purchase failed.';
            success = '';
        }
    }
</script>

<h1>Pet Shop</h1>

{#if user}
    <p>Budget: ${user.budget}</p>
    <p>Inventory: 🥫 {user.inventory.food} | 🧸 {user.inventory.toy} | 🍬 {user.inventory.treat}</p>

    {#if success}<p style="color: green;">{success}</p>{/if}
    {#if error}<p style="color: red;">{error}</p>{/if}

    <button on:click={() => buy('food')}>Buy Food ($10)</button>
    <button on:click={() => buy('toy')}>Buy Toy ($15)</button>
    <button on:click={() => buy('treat')}>Buy Treat ($30)</button>
{/if}

<style>
    button {
        padding: 0.5rem;
        font-size: 1rem;
        margin-right: 0.5rem;
    }
</style>
