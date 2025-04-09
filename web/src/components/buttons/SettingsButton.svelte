<script
    lang="ts"
    generics="
        Context extends Exclude<keyof DecimatorSettings, 'schemaVersion'>,
        Id extends keyof DecimatorSettings[Context],
        Value extends DecimatorSettings[Context][Id]
    "
>
    import settings, { updateSetting } from "$lib/state/settings";
    import type { DecimatorSettings } from "$lib/types/settings";

    export let settingContext: Context;
    export let settingId: Id;
    export let settingValue: Value;

    $: setting = $settings[settingContext][settingId];
    $: isActive = setting === settingValue;
</script>

<button
    id="setting-button-{settingContext}-{String(settingId)}-{settingValue}"
    class="button"
    class:active={isActive}
    aria-pressed={isActive}
    on:click={() =>
        updateSetting({
            [settingContext]: {
                [settingId]: settingValue,
            },
        })}
>
    <slot></slot>
</button>
