<script>
    import IconDecimator from "$components/icons/Decimator.svelte";
</script>

<div id="decimator-logo">
    <IconDecimator theme={null}/>
</div>

<style>
    #decimator-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: calc(var(--padding) * 2);
        padding-bottom: calc(var(--padding) * 2 - var(--sidebar-inner-padding));
    }

    @media screen and (max-width: 535px) {
        #decimator-logo {
            display: none;
        }
    }
</style>
