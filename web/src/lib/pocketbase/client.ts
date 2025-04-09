import { browser } from '$app/environment';
import PocketBase from 'pocketbase';
import type { RecordAuthResponse } from 'pocketbase';
import { writable, derived } from 'svelte/store';
import { goto } from '$app/navigation';
import { WEB_POCKETBASE_URL } from '$env/static/public';
const authorizedDomains = (import.meta.env.VITE_WEB_AUTHORIZED_DOMAINS || '').split(',').map((d: string) => d.trim());

// Define a type for users
export interface User {
    id: string;
    email: string;
    username?: string;
    name?: string;
    avatarUrl?: string;
    created?: string;
    updated?: string;
    [key: string]: unknown; // Allow for additional properties from PocketBase
}

export const authStore = writable<{
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    error: string | null;
}>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
});

// Export derived stores for convenience
export const isAuthenticated = derived(authStore, $auth => $auth.isAuthenticated);
export const user = derived(authStore, $auth => $auth.user);
export const isLoading = derived(authStore, $auth => $auth.isLoading);
export const authError = derived(authStore, $auth => $auth.error);

// Create the PocketBase client
export const pb = new PocketBase(WEB_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Flag to prevent multiple initializations
let initialized = false;

// Helper function to convert PocketBase record to User
function recordToUser(record: RecordAuthResponse['record']): User {
    return {
        id: record.id,
        email: record.email as string,
        username: record.username as string,
        name: record.name as string,
        avatarUrl: record.avatarUrl as string,
        created: record.created,
        updated: record.updated
    };
}

// When the app starts, check if we have a valid session
export async function initializeAuth() {
    if (!browser || initialized) return;
    initialized = true;

    // Load auth from cookies first
    pb.authStore.loadFromCookie(document.cookie);

    console.log('initializeAuth started, pb.authStore.isValid:', pb.authStore.isValid);
    try {
        if (pb.authStore.isValid) {
            console.log('Attempting authRefresh');
            await pb.collection('users').authRefresh();
            console.log('authRefresh successful, user:', pb.authStore.record);

            const email = (pb.authStore.record as RecordAuthResponse['record'])?.email;
            const isAuthorized = await verifyDomainAccess(email);
            if (!isAuthorized) {
                console.warn('Unauthorized domain during session refresh');
                pb.authStore.clear();
                authStore.set({
                    isAuthenticated: false,
                    user: null,
                    isLoading: false,
                    error: 'Unauthorized domain.'
                });
                goto('/unauthorized');
                return;
            }

            authStore.update(state => ({
                ...state,
                isAuthenticated: true,
                user: recordToUser(pb.authStore.record as RecordAuthResponse['record']),
                isLoading: false
            }));
        } else {
            console.log('No valid auth store');
            authStore.update(state => ({
                ...state,
                isLoading: false
            }));
        }
    } catch (error) {
        console.error('Auth refresh failed:', error);
        pb.authStore.clear();
        authStore.update(state => ({
            ...state,
            isAuthenticated: false,
            user: null,
            isLoading: false
        }));
    }
}

// Login with Google OAuth
export async function loginWithGoogle() {
    try {
        authStore.update(state => ({
            ...state,
            isLoading: true,
            error: null
        }));

        const authMethods = await pb.collection('users').listAuthMethods();

        if (!authMethods?.oauth2?.providers) {
            throw new Error("OAuth providers not available");
        }

        const googleProvider = authMethods.oauth2.providers.find(p => p.name === 'google');
        if (!googleProvider) {
            throw new Error("Google provider not configured");
        }

        localStorage.setItem('oauthState', googleProvider.state);
        localStorage.setItem('oauthCodeVerifier', googleProvider.codeVerifier);

        const redirectUrl = `${window.location.origin}/auth/callback`;
        const authUrl = new URL(googleProvider.authURL);
        authUrl.searchParams.set('redirect_uri', redirectUrl);

        console.log("Redirecting to OAuth URL:", authUrl.toString());
        window.location.href = authUrl.toString();
    } catch (error) {
        console.error('Error initiating Google login:', error);
        authStore.update(state => ({
            ...state,
            isLoading: false,
            error: 'Failed to start Google authentication'
        }));
    }
}

// Handle OAuth callback verification
export async function handleOAuthCallback(provider: string, code: string, codeVerifier: string, redirectUrl: string) {
    try {
        const authData = await pb.collection('users').authWithOAuth2Code(provider, code, codeVerifier, redirectUrl);

        const email = authData.record.email;
        const isAuthorized = await verifyDomainAccess(email);
        console.log('Domain authorization result:', isAuthorized);

        if (!isAuthorized) {
            pb.authStore.clear();
            authStore.set({
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: 'Your email domain is not authorized to use this app.'
            });
            goto('/unauthorized');
            throw new Error('Unauthorized domain login attempt blocked');
        }


        authStore.set({
            isAuthenticated: true,
            user: recordToUser(authData.record),
            isLoading: false,
            error: null
        });
    } catch (error) {
        console.error('OAuth callback error:', error);
        pb.authStore.clear();
        authStore.set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: 'OAuth callback failed'
        });
        goto('/login');
    }
}

// Verify domain access
export async function verifyDomainAccess(email: string): Promise<boolean> {
    const domain = email.split('@')[1];
    console.log('Verifying domain for:', email);
    const isAuthorized = authorizedDomains.includes(domain);
    console.log('Authorized domains:', authorizedDomains);
    console.log('Domain authorized:', isAuthorized);
    return isAuthorized;
}

// Logout function
export function logout() {
    pb.authStore.clear();
    document.cookie = "pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    authStore.set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
    });
    window.location.href = '/login'; // Force full reload
}