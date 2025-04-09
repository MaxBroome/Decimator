<script lang="ts">
    import { logout } from '$lib/pocketbase/client';
    import IconAlertTriangle from '@tabler/icons-svelte/IconAlertTriangle.svelte';

    const authorizedDomains = (import.meta.env.VITE_WEB_AUTHORIZED_DOMAINS || '').split(',').map((d: string) => d.trim());
    const domainText = authorizedDomains.length > 1
        ? `one of the following domains: ${authorizedDomains.join(', ')}`
        : `the domain ${authorizedDomains[0]}`;
</script>

<div class="unauthorized-container center-column-container">
    <div class="unauthorized-card">
        <div class="icon-container">
            <IconAlertTriangle />
        </div>
        
        <h1>Unauthorized Access</h1>
        
        <p>Sorry, but access to this application is restricted to users with email addresses from {domainText}.</p>
        
        <button class="logout-button" on:click={logout}>
            Log Out
        </button>
    </div>
</div>

<style>
    .unauthorized-container {
        height: 100vh;
        width: 100%;
    }
    
    .unauthorized-card {
        width: 100%;
        max-width: 500px;
        padding: 40px;
        background-color: var(--button);
        border-radius: var(--border-radius);
        box-shadow: var(--button-box-shadow);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 20px;
    }
    
    .icon-container {
        width: 80px;
        height: 80px;
        background-color: rgba(237, 34, 54, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .icon-container :global(svg) {
        width: 48px;
        height: 48px;
        color: var(--red);
        stroke-width: 1.5px;
    }
    
    h1 {
        font-size: 24px;
        margin: 0;
    }
    
    p {
        font-size: 16px;
        line-height: 1.6;
        color: var(--gray);
        margin: 0;
    }
    
    .logout-button {
        margin-top: 10px;
        padding: 12px 24px;
        background-color: var(--button-elevated);
        border-radius: var(--border-radius);
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .logout-button:hover {
        background-color: var(--button-elevated-hover);
    }
</style>