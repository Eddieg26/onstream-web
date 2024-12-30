import { Nullable } from ".";

export interface Channel {
    id: number;
    name: string;
    contentId: string;
    logo: string;
    hlsUrl: string;
    dashUrl: string;
    programs: Program[];
}

export interface Program {
    title: string;
    description: string;
    titleLanguage: Nullable<string>;
    descriptionLanguage: Nullable<string>;
    echostarId: string;
    echostarSeriesId: Nullable<string>;
    echostarEpisodeId: Nullable<string>;
    seriesTitle: Nullable<string>;
    episodeNumber: Nullable<number>;
    seasonNumber: Nullable<number>;
    genres: string[];
    originalAirDate: Nullable<string>;
    type: Nullable<string>;
    rating: Nullable<string>;
    ratingBody: Nullable<string>;
    releaseYear: Nullable<number>;
    episodeSeasonLine: Nullable<string>;
    poster: Nullable<string>;
    startTime: number;
    endTime: number;
    duration: number;
    channel?: {
        id: string;
        name: string;
        content: string;
    };
    meta?: {
        isFiller: boolean;
        visualDuration: number;
    };
    eventName: undefined;
}
