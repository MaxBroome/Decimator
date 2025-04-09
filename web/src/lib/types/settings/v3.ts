import type { YoutubeLang } from "$lib/settings/youtube-lang";
import { type DecimatorSettingsV2 } from "$lib/types/settings/v2";

export type DecimatorSettingsV3 = Omit<DecimatorSettingsV2, 'schemaVersion' | 'save'> & {
    schemaVersion: 3,
    save: Omit<DecimatorSettingsV2['save'], 'youtubeDubBrowserLang'> & {
        youtubeDubLang: YoutubeLang;
    };
};
