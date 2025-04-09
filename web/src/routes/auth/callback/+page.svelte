<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { pb, authStore, authError, isLoading, verifyDomainAccess } from '$lib/pocketbase/client';
    import Unauthorized from '$components/misc/Unauthorized.svelte';

    let processingOAuth = true;
    let success = false;
    let unauthorized = false;
    let detailedError: string | null = null;
    let unsubscribe: () => void;

    onMount(async () => {
        // Subscribe to authStore for real-time monitoring
        unsubscribe = authStore.subscribe(state => {
            console.log('authStore updated:', state);
        });

        try {
            console.group('OAuth Callback Debug');
            console.log('Initial page state:', $page.url.toString());

            const redirectTo = $page.url.searchParams.get('redirect') || '/';
            console.log('Redirect destination:', redirectTo);

            const code = $page.url.searchParams.get('code');
            const state = $page.url.searchParams.get('state');
            const storedState = localStorage.getItem('oauthState');
            const codeVerifier = localStorage.getItem('oauthCodeVerifier');

            console.log("OAuth Parameters:", { 
                code: !!code, 
                state: !!state, 
                storedState: !!storedState, 
                codeVerifier: !!codeVerifier 
            });

            if (!code || !state || !storedState || !codeVerifier) {
                throw new Error("Missing OAuth parameters");
            }

            if (state !== storedState) {
                throw new Error("OAuth state mismatch");
            }

            const authData = await pb.collection('users').authWithOAuth2Code(
                'google',
                code,
                codeVerifier,
                `${window.location.origin}/auth/callback`
            );

            console.log("Full authentication data:", authData);

            localStorage.removeItem('oauthState');
            localStorage.removeItem('oauthCodeVerifier');

            const userEmail = authData.record.email as string;
            console.log('User email:', userEmail);

            const authorized = await verifyDomainAccess(userEmail);
            console.log('Domain authorization result:', authorized);

            if (!authorized) {
                console.error(`Unauthorized domain: ${userEmail.split('@')[1]}`);
                pb.authStore.clear();
                unauthorized = true;
                authStore.update(s => ({
                    ...s,
                    isAuthenticated: false,
                    user: null,
                    isLoading: false,
                    error: `Access restricted to authorized domains. Your domain (${userEmail.split('@')[1]}) is not authorized.`
                }));
                detailedError = `Access restricted to authorized domains. Your domain (${userEmail.split('@')[1]}) is not authorized.`;
            } else {
                authStore.update(s => {
                    console.log('Updating authStore before redirect:', s);
                    return {
                        ...s,
                        isAuthenticated: true,
                        user: {
                            id: authData.record.id,
                            email: authData.record.email as string,
                            username: authData.record.username as string,
                            name: authData.record.name as string,
                            avatarUrl: authData.record.avatarUrl as string,
                            created: authData.record.created,
                            updated: authData.record.updated
                        },
                        isLoading: false,
                        error: null
                    };
                });

                success = true;
                    // Add cookie persistence before redirect
                    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
                // Increased delay for testing, revert to 1000ms once stable
                setTimeout(() => {
                    console.log('Redirecting to:', redirectTo, 'authStore:', $authStore);
                    goto(redirectTo);
                }, 3000); // Increased from 1000ms to 3000ms for debugging
            }
        } catch (error) {
            console.error('Authentication error:', error);
            processingOAuth = false;
            detailedError = error instanceof Error 
                ? error.message 
                : 'Authentication failed';
            authStore.update(s => ({
                ...s,
                isLoading: false,
                error: detailedError
            }));
        } finally {
            if (processingOAuth) {
                processingOAuth = false;
            }
            console.groupEnd();
        }
    });

    onDestroy(() => {
        if (unsubscribe) unsubscribe();
    });
</script>

{#if unauthorized}
    <Unauthorized />
{:else}
    <div class="callback-container center-column-container">
        <div class="callback-card">
            <div class="icon-container">
                {#if processingOAuth || $isLoading}
                    <div class="loading-spinner"></div>
                {:else if success}
                    <div class="success-icon">✓</div>
                {:else}
                    <div class="error-icon">✕</div>
                {/if}
            </div>

            <h2 class="status-text">
                {#if processingOAuth || $isLoading}
                    Completing authentication...
                {:else if success}
                    Authentication successful!
                {:else}
                    Authentication failed
                {/if}
            </h2>

            {#if !processingOAuth && !success && detailedError}
                <div class="error-message">
                    {detailedError}
                </div>
            {/if}

            {#if !processingOAuth && !success && !unauthorized}
                <a href="/login" class="retry-button">
                    Return to login
                </a>
            {/if}
        </div>
    </div>
{/if}

<style>
    .callback-container {
        height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .callback-card {
        width: 100%;
        max-width: 400px;
        padding: 30px;
        background-color: var(--button);
        border-radius: var(--border-radius);
        box-shadow: var(--button-box-shadow);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .icon-container {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        margin-bottom: 10px;
    }

    .loading-spinner {
        width: 48px;
        height: 48px;
        border: 5px solid var(--button-elevated);
        border-top-color: var(--secondary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .success-icon {
        width: 64px;
        height: 64px;
        background-color: var(--green);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
    }

    .error-icon {
        width: 64px;
        height: 64px;
        background-color: var(--red);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
    }

    .status-text {
        font-size: 20px;
        text-align: center;
        margin: 0;
    }

    .error-message {
        color: var(--red);
        text-align: center;
        max-width: 300px;
    }

    .retry-button {
        padding: 10px 20px;
        background-color: var(--button-elevated);
        color: var(--secondary);
        border-radius: var(--border-radius);
        text-decoration: none;
        margin-top: 10px;
        display: inline-block;
    }

    .retry-button:hover {
        background-color: var(--button-elevated-hover);
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>