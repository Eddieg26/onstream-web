import { PageSettings, PropertySettings } from ".";

export type PropertyType = "Hospitality" | "MDU";

export interface Property {
    id: string;
    name: string;
    description: string;
    smartboxId: string;
    chassisId: string;
    status: string;
    type: PropertyType;
    config: PropertyConfig;
}

export interface PropertyConfig {
    assets: {
        background: string;
        logo: string;
    };

    settings: PropertySettings;

    endpoints: {
        atx: string;
        epg: string;
        sports: string;
        supair: string;
        weatherBase: string;
        weatherImage: string;
    };

    casting: {
        clientSSID: string;
        enableMediaCastingPage: boolean;
        googleCastIp: string;
    };

    sesInfo: {
        chassis: string;
        cpu: string;
        enableDigitalVideoRecorder: boolean;
        enableTimeShiftBuffer: boolean;
        nic: string;
        sesEnabled: boolean;
        storage: string;
    };

    licenceKeys: {
        bitmovin: string;
        fairplay: {
            certificate: string;
            url: string;
        };
        playReady: string;
        widevine: string;
    };

    theme: {
        primary: string;
    };

    legal: {
        contact: string;
        privacyPolicy: string;
        termsOfUse: string;
    };
    faq: string;
    zipCode: string;

    __type: PropertyType;
}

export interface MduConfig extends PropertyConfig {
    pages: {
        home: PageSettings;
        propertyInfo: PageSettings;
    };

    __type: "MDU";
}

export interface HospitalityConfig {
    pages: {
        home: PageSettings;
        hotelInfo: PageSettings;
        mystay: PageSettings;
        watch: PageSettings;
        mediaCasting: Pick<PageSettings, "enabled">;
        settings: Pick<PageSettings, "enabled">;
    };
}
