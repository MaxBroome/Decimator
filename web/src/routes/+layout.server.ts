import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Public routes that don't require authentication
const publicRoutes = ['/login', '/auth/callback'];

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    // Check if the current route is public
    const isPublicRoute = publicRoutes.some(route => url.pathname.startsWith(route));
    
    // Get the auth cookie that would be set by PocketBase
    const authCookie = cookies.get('pb_auth');
    const isAuthenticated = !!authCookie;
    
    // If the route is not public and the user is not authenticated, redirect to login
    if (!isPublicRoute && !isAuthenticated) {
        // Add the current URL as a redirect target after login
        const redirectTo = encodeURIComponent(url.pathname + url.search);
        throw redirect(302, `/login?redirect=${redirectTo}`);
    }
    
    // If the user is authenticated and trying to access the login page, redirect to home
    if (isAuthenticated && url.pathname === '/login') {
        throw redirect(302, '/');
    }
    
    return {
        isAuthenticated
    };
};