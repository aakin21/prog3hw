<script lang="ts">
    import { onMount } from 'svelte';
    let logs: string[] = [];
    let error = '';

    onMount(async () => {
        // TODO get logs
        const res = await fetch('/api/logs');
        if (res.ok) {
            const data = await res.json();
            logs = data.reverse(); // newest on top
        } else {
            error = 'Failed to load logs';
        }
    });
</script>

<h1>Action Log</h1>

{#if error}
    <p style="color: red;">{error}</p>
{:else if logs.length === 0}
    <p>No actions have been logged yet.</p>
{:else}
    <!--   render logs here with the newest on top-->
    <ul>
        {#each logs as log}
            <li>{log}</li>
        {/each}
    </ul>
{/if}

<style>
</style>
