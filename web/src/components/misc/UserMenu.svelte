<script lang="ts">
    import { user, logout } from '$lib/pocketbase/client';
    import IconUser from '@tabler/icons-svelte/IconUser.svelte';
    import IconLogout from '@tabler/icons-svelte/IconLogout.svelte';
    
    let menuOpen = false;
    
    function toggleMenu() {
        menuOpen = !menuOpen;
    }
    
    function handleLogout() {
        logout();
        menuOpen = false;
    }
    
    // Close the menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
        if (menuOpen && !event.composedPath().some((el: Element | EventTarget) => {
            return (el as Element)?.id === 'user-menu';
        })) {
            menuOpen = false;
        }
    }
    
    // Add and remove event listener
    import { onMount, onDestroy } from 'svelte';
    
    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });
    
    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>

<div id="user-menu" class="user-menu" class:menu-open={menuOpen}>
    <button class="user-button" on:click={toggleMenu} aria-haspopup="true" aria-expanded={menuOpen}>
        <div class="user-avatar">
            {#if $user?.avatarUrl}
                <img src={$user.avatarUrl} alt="User avatar" />
            {:else}
                <IconUser />
            {/if}
        </div>
    </button>
    
    {#if menuOpen}
        <div class="menu-dropdown">
            <div class="user-info">
                <div class="user-name">{$user?.name || $user?.username || 'User'}</div>
                <div class="user-email">{$user?.email || ''}</div>
            </div>
            
            <div class="menu-divider"></div>
            
            <button class="menu-item" on:click={handleLogout}>
                <IconLogout />
                <span>Logout</span>
            </button>
        </div>
    {/if}
</div>

<style>
    .user-menu {
        position: relative;
    }
    
    .user-button {
        background: none;
        border: none;
        border-radius: 50%;
        padding: 0;
        cursor: pointer;
        width: 40px;
        height: 40px;
        overflow: hidden;
        box-shadow: var(--button-box-shadow);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--button);
    }
    
    .user-avatar {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .user-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .user-avatar :global(svg) {
        width: 20px;
        height: 20px;
        stroke-width: 1.5px;
    }
    
    .menu-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 220px;
        background-color: var(--button);
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10;
        overflow: hidden;
        animation: menu-appear 0.2s ease-out;
    }
    
    .user-info {
        padding: 12px 16px;
    }
    
    .user-name {
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 4px;
    }
    
    .user-email {
        font-size: 12px;
        color: var(--gray);
    }
    
    .menu-divider {
        height: 1px;
        background-color: var(--button-stroke);
        margin: 4px 0;
    }
    
    .menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        width: 100%;
        text-align: left;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 14px;
    }
    
    .menu-item:hover {
        background-color: var(--button-hover);
    }
    
    .menu-item :global(svg) {
        width: 18px;
        height: 18px;
        stroke-width: 1.5px;
    }
    
    @keyframes menu-appear {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>