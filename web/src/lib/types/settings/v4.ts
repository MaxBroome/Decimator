import { type DecimatorSettingsV3 } from "$lib/types/settings/v3";

export type DecimatorSettingsV4 = Omit<DecimatorSettingsV3, 'schemaVersion' | 'processing'> & {
    schemaVersion: 4,
    processing: Omit<DecimatorSettingsV3['processing'], 'allowDefaultOverride' | 'seenOverrideWarning'> & {
        customApiKey: string;
        enableCustomApiKey: boolean;
    };
};
