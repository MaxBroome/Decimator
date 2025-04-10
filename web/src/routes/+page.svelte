<script>
    import { t } from "$lib/i18n/translations";
    import { isLoading, isAuthenticated } from '$lib/pocketbase/client';
    import { goto } from '$app/navigation';

    import currentTheme from "$lib/state/theme";
    import Omnibox from "$components/save/Omnibox.svelte";
    import SupportedServices from "$components/save/SupportedServices.svelte";
    import IconDecimator from "$components/icons/Decimator.svelte";

    $: if (!$isLoading && !$isAuthenticated) {
        goto('/login');
    }
</script>

<svelte:head>
    <title>{$t("decimator")}</title>
    <meta property="og:title" content={$t("decimator")} />
</svelte:head>

<div id="decimator-save-container" class="center-column-container">
    <SupportedServices />
    <main
        id="decimator-save"
        tabindex="-1"
        data-first-focus
        data-focus-ring-hidden
    >
    <div class="logo-icon">
        <IconDecimator theme={$currentTheme} />
    </div>
        <Omnibox/>
    </main>
    <div id="love-note">
        made with &#x2764; by
         <a target="_blank" rel="noopener noreferrer" href="https://broomfieldhomelab.net/">Max Broomfield</a> '25
    </div>
</div>

<style>
    #decimator-save-container {
        padding: var(--padding);
        overflow: hidden;
    }

    #decimator-save {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        gap: 15px;
    }

    .logo-icon {
        width: 76px;
        height: 76px;
    }

    #love-note {
        bottom: 0;
        color: var(--gray);
        font-size: 13px;
        text-align: center;
        padding-bottom: var(--padding);
        font-weight: 500;
    }

    @media screen and (max-width: 535px) {
        #decimator-save-container {
            padding-top: calc(var(--padding) / 2);
        }

        #love-note {
            font-size: 11px;
            padding-bottom: 0;
        }
    }
</style>
