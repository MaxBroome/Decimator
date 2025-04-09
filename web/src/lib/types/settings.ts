import type { RecursivePartial } from "$lib/types/generic";
import type { DecimatorSettingsV2 } from "$lib/types/settings/v2";
import type { DecimatorSettingsV3 } from "$lib/types/settings/v3";
import type { DecimatorSettingsV4 } from "$lib/types/settings/v4";

export * from "$lib/types/settings/v2";
export * from "$lib/types/settings/v3";
export * from "$lib/types/settings/v4";

export type DecimatorSettings = DecimatorSettingsV4;

export type AnyDecimatorSettings = DecimatorSettingsV3 | DecimatorSettingsV2 | DecimatorSettings;

export type PartialSettings = RecursivePartial<DecimatorSettings>;

export type AllPartialSettingsWithSchema = RecursivePartial<AnyDecimatorSettings> & { schemaVersion: number };

export type DownloadModeOption = DecimatorSettings['save']['downloadMode'];
