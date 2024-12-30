/**
 * DVR type notes:
 * - dvrId and dvrID are both used as an inconsistency from the API
 * - some types may not currently match up - the schema on the docs and the data shown mismatch (string when it should be a number, or vice versa)
 * - metadata is shown as null in one of the data sets returned, yet the metadata object fields exist on the same level in the recording object
 */

// ---- API response structures / types ----
// /dvr/v1/storage/{userId} + nested within other responses
export interface RecordingStorageInfo {
  lowStorage: boolean;
  criticalStorage: boolean;
  usedStorageSecs: number;
  totalStorageSecs: number;
}

export enum RecordingStatus {
  Completed = "Completed",
  Upcoming = "Upcoming",
  InProgress = "InProgress",
}

export interface CrewMember {
  first_name: string;
  full_name: string;
  gender: string;
  image_url: string;
  last_name: string;
  person_id: number;
  rms_image_id: number;
  rms_image_path: string;
  rms_image_type: number;
}

// todo: not sure if null is valid - null showing up looks like an error on the documentation side
export type RecordingMetadata = null | {
  crew_info: CrewMember[];
  description: string | null;
  description_language: string;
  echostarId: string;
  echostarEpisodeId: number;
  echostarSeriesId: number;
  genres: string[];
  originalAirDate: string;
  programType: string;
  poster: string;
  rating: string | null;
  ratingBody: string | null;
  releaseYear: number;
  richmedia_image_info: {
    cdn_16x9_url: string;
    image_id: number;
    image_path: string;
    image_type: number;
    image_url: string;
  };
  runtime: number;
  seriesTitle: string;
  title: string;
  titleLanguage: string;
};

// /dvr/v1/recordings/{userId}/{dvrId} + nested within other responses
export interface Recording {
  apiVer: string;
  dvrID: string;
  title?: string; // expected to be added on the SES side at some point
  seriesStack: boolean;
  totalEpisodes: number;
  channelName: string;
  playbackHls: string; // not available in upcoming
  playbackDash: string; // not available in upcoming
  echostarId: string;
  recordingStatus: RecordingStatus;
  recordingStartTime: string;
  recordingEndTime: string;
  recDuration: number; // seconds
  serviceKey: number;
  metadata: RecordingMetadata;
  storageInfo: RecordingStorageInfo;
  lastWatchDuration: number; // seconds
  recInitialSeek: number; // seconds
}

// /dvr/v1/recordings/{userId}
export interface AllRecordingsResponse {
  apiVer: string;
  recordings: Recording[];
}

// /dvr/v1/recordings/{userId}/{seriesId}
export interface SeriesDetailsResponse {
  apiVer: string;
  dvrID: string;
  channelName: string;
  seriesStack: boolean;
  totalEpisode: number;
}

// /dvr/v1/recordings/{userId}/{seriesId}/episodes
export interface AllSeriesEpisodesResponse {
  apiVer: string;
  dvrID: string;
  episodes: Recording[];
  storageInfo: RecordingStorageInfo;
}

// /dvr/v1/recordings/{dvrId}/resumePoint
export interface ResumePointResponse {
  dvrId: string;
  userId: string;
  lastWatchDuration: number;
}

// /dvr/v1/features
export interface FeatureResponse {
  apiVer: string;
  tsb: {
    tsbEnable: boolean;
    tsbSufficientStorage: boolean;
    tsbDurationSecs: number;
  };
  dvr: {
    dvrEnable: boolean;
  };
}

// ---- request body structures / types ----
// request body for scheduling a recording
export interface ScheudleRecordingRequestBody {
  recordType: "single" | "new" | "all"; // todo: validate these are the options and what they mean
  scheduleRecord: string | boolean; // string schema, boolean in data shown
  channelId: string;
  echostarId: string;
  echostar_series_info: {
    echostar_episode_id: number;
    echostar_event_string: string | number; // number in schema, string in data
    echostar_series_id: number;
  };
  autoDeleteProtected: boolean;
  userId: string;
  startTime: string;
}

// request body for updating where a recording should resume
export interface UpdateResumePointRequestBody {
  userId: string;
  lastWatchDuration: number;
}
// request body for updating auto delete protection
export interface UpdateAutoDeleteProtectRequestBody {
  userId: string;
  autoDeleteProtected: boolean;
}
