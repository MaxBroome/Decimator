export const prerender = false;
export const ssr = true;

import { browser } from '$app/environment';

import { get } from 'svelte/store';
import { initializeAuth } from '$lib/pocketbase/client';
import type { LayoutLoad } from './$types';

import { loadTranslations, defaultLocale } from '$lib/i18n/translations';

export const load: LayoutLoad = async ({ url }) => {
    // Initialize authentication on the client side
    if (browser) {
        await initializeAuth();
    }
    const { pathname } = url;

    let preferredLocale = defaultLocale;

    if (browser) {
        preferredLocale = get((await import('$lib/i18n/locale')).default);
    }

    await loadTranslations(preferredLocale, pathname);
    return {};
}
