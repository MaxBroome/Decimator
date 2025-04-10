<script lang="ts">
    import { onMount } from 'svelte';
    import { isAuthenticated, authError, loginWithGoogle, isLoading } from '$lib/pocketbase/client';
    import { goto } from '$app/navigation';
    import IconBrandGoogle from '@tabler/icons-svelte/IconBrandGoogle.svelte';
    import { page } from '$app/stores';
    import { writable } from 'svelte/store';
    import IconDecimator from "$components/icons/Decimator.svelte"
    import currentTheme from "$lib/state/theme";

    const authChecked = writable(false);

    onMount(() => {
        const unsubscribe = isAuthenticated.subscribe(authenticated => {
            if (authenticated) {
                const redirectTo = $page.url.searchParams.get('redirect') || '/';
                goto(redirectTo);
            } else {
                authChecked.set(true);
            }
        });

        return unsubscribe;
    });

    const authorizedDomains = (import.meta.env.VITE_WEB_AUTHORIZED_DOMAINS || '').split(',').map((d: string) => d.trim());
</script>

<svelte:head>
    <title>Login - Decimator</title>
</svelte:head>

{#if $authChecked}
    <div id="login-container" class="center-column-container">
        <div class="login-card">
            <div class="logo-section">
                <div class="logo-icon">
                    <IconDecimator theme={$currentTheme} />
                </div>
                <h1 class="title">Decimator</h1>
                <!-- <p class="subtitle">Welcome to Decimator!</p> -->
                <p class="subtitle">Please sign in to continue.</p>
            </div>

            {#if $authError}
                <div class="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{$authError}</span>
                </div>
            {/if}

            {#if authorizedDomains.length > 0}
                <div class="domain-info">
                    <h3>Restricted Access</h3>
                    <p>At this time use is allowed only for members of the following organizations:</p>
                    <ul>
                        {#each authorizedDomains as domain}
                            <li>{domain}</li>
                        {/each}
                    </ul>
                </div>
            {/if}
            <button 
                on:click={loginWithGoogle} 
                class="login-button" 
                disabled={$isLoading}
                aria-label="Sign in with Google"
            >
                {#if $isLoading}
                    <span class="loading-spinner"></span>
                    <span>Authenticating...</span>
                {:else}
                    <IconBrandGoogle />
                    <span>Sign in with Google</span>
                {/if}
            </button>
        </div>
    </div>
{/if}

<style>
    #login-container {
        height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        background-color: var(--primary);
        background-image: radial-gradient(circle at 10% 20%, rgba(var(--primary-rgb), 0.03) 0%, rgba(var(--primary-rgb), 0) 80%);
    }

    .login-card {
        width: 100%;
        max-width: 420px;
        padding: 40px;
        border-radius: var(--border-radius);
        background-color: var(--button);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
        gap: 24px;
        animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .logo-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        margin-bottom: 8px;
    }

    .logo-icon {
        width: 76px;
        height: 76px;
        background-color: color-mix(in srgb, var(--secondary) 25%, transparent);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .logo-icon:hover {
        transform: scale(1.05);
    }

    .logo-icon :global(svg) {
        width: 42px;
        height: 42px;
        transform: translateY(-2px) translateX(1px);
    }

    .title {
        font-size: 28px;
        font-weight: 700;
        text-align: center;
        margin: 0;
        letter-spacing: -0.02em;
    }

    .subtitle {
        font-size: 16px;
        text-align: center;
        color: var(--gray);
        margin: 0;
    }

    .login-button {
        padding: 14px 20px;
        background-color: var(--button-elevated);
        border: none;
        border-radius: var(--border-radius);
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--text);
    }

    .login-button:hover {
        background-color: var(--button-elevated-hover);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .login-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .login-button[disabled] {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    .error-message {
        background-color: rgba(237, 34, 54, 0.1);
        border-left: 3px solid var(--red);
        color: var(--red);
        padding: 12px 16px;
        border-radius: 6px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .domain-info {
        background-color: var(--button-elevated);
        padding: 16px;
        border-radius: var(--border-radius);
    }

    .domain-info h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
    }

    .domain-info p {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: var(--gray);
    }

    .domain-info ul {
        margin: 0;
        padding-left: 20px;
    }

    .domain-info li {
        font-size: 14px;
        padding: 4px 0;
    }

    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.2);
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        display: inline-block;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
        .login-card {
            max-width: 90%;
            padding: 30px 20px;
        }
        
        .title {
            font-size: 24px;
        }
    }
</style>