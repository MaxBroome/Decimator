import type { DecimatorSettings } from "$lib/types/settings";
import defaults from "./defaults";

export default function lazySettingGetter(settings: DecimatorSettings) {
    // Returns the setting value only if it differs from the default.
    return <
        Context extends Exclude<keyof DecimatorSettings, 'schemaVersion'>,
        Id extends keyof DecimatorSettings[Context]
    >(context: Context, key: Id) => {
        if (defaults[context][key] !== settings[context][key]) {
            return settings[context][key];
        }
    }
}
