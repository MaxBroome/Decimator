<script lang="ts">
    import { createDialog } from "$lib/state/dialogs";
    import IconLogout from "@tabler/icons-svelte/IconLogout.svelte";
    import IconUserX from "@tabler/icons-svelte/IconUserX.svelte";

    import { pb, authStore } from "$lib/pocketbase/client";

    const logout = () => {
        pb.authStore.clear();
        document.cookie = "pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        authStore.set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null
        });
        window.location.href = '/login';
    };

    const confirmAccountDeletion = () => {
        createDialog({
            id: "account-delete-confirm",
            type: "small",
            icon: "warn-red",
            title: "Delete Account",
            bodyText: "Are you sure you want to permanently delete your account? This action cannot be undone.",
            buttons: [
                {
                    text: "Cancel",
                    main: false,
                    action: () => {},
                },
                {
                    text: "Delete",
                    color: "red",
                    main: true,
                    timeout: 2000,
                    action: async () => {
                        try {
                            const userId = pb.authStore.record?.id;
                            if (!userId) throw new Error("User not logged in");
                            await pb.collection('users').delete(userId);
                            logout();
                        } catch (err) {
                            console.error("Account deletion failed:", err);
                            createDialog({
                                id: "delete-error",
                                type: "small",
                                meowbalt: "error",
                                bodyText: "Failed to delete account. Please try again later.",
                                buttons: [{ text: "OK", main: true, action: () => {} }],
                            });
                        }
                    },
                },
            ],
        });
    };
</script>

<div class="button-row" id="settings-account-actions">
    <button id="setting-button-logout" class="button" on:click={logout}>
        <IconLogout />
        Sign Out
    </button>

    <button id="setting-button-delete" class="button danger" on:click={confirmAccountDeletion}>
        <IconUserX />
        Delete Account
    </button>
</div>

<style>
    .button-row {
        display: flex;
        gap: var(--padding);
        flex-wrap: wrap;
        margin-top: var(--padding);
    }

    #setting-button-logout {
        background-color: var(--gray);
        color: var(--white);
        width: max-content;
        text-align: start;
    }

    #setting-button-logout:hover {
        background-color: var(--dark-grey);
    }

    #setting-button-delete {
        background-color: var(--red);
        color: var(--white);
        width: max-content;
        text-align: start;
    }

    #setting-button-delete:hover {
        background-color: var(--dark-red);
    }

    #setting-button-logout :global(svg),
    #setting-button-delete :global(svg) {
        stroke-width: 2px;
        height: 24px;
        width: 24px;
    }
</style>
