import {
	CognitoUserAttribute,
	CognitoUserPool,
	CognitoUserSession,
	ICognitoUserSessionData,
} from "amazon-cognito-identity-js";
import { Api } from "../api";
import { ContainerLayout } from "./widgets";

export * from "./epg";
export * from "./property";
export * from "./recording";
export * from "./sports";
export * from "./weather";
export * from "./widgets";

export type Nullable<T> = T | null | undefined;
export type NullFields<T> = {
	[K in keyof T]: Nullable<T[K]>;
};

export type Environment = "development" | "production" | "test";
export type Platform = "browser" | "android" | "roku" | "firetv" | "lg";

export interface PageSettings {
	enabled: boolean;
	element: string;
	type: string;
}

export interface PageMeta {
	id: string;
	publishedFrom: number;
	typeAlias: string;
	typeId: string;
}

export interface PageLayout {
	title: string;
	items: ContainerLayout[];
	platform: Platform;
	meta: PageMeta;
}

export type Page =
	| "/"
	| "watch"
	| "tv-guide"
	| "on-demand"
	| "cast-modal"
	| "my-stay"
	| "community-info"
	| "search"
	| "hotel-info"
	| "recordings"
	| "sign-in"
	| "sign-up"
	| "player"
	| "settings"
	| "settings/app"
	| "settings/account"
	| "settings/faqs"
	| "settings/legal"
	| "settings/privacy"
	| "settings/terms"
	| "settings/parental"
	| "settings/temperature"
	| "settings/time"
	| "sports"
	| "seeall"
	| "seeall/ondemand/popular-shows"
	| "seeall/ondemand/popular-movies"
	| "seeall/sports/nfl"
	| "seeall/sports/nhl"
	| "seeall/sports/nba"
	| "seeall/sports/mlb"
	| "seeall/home/category"
	| "devtools"
	| "preview"
	| "404";

export type PageConfig = {
	title: string;
	page: Page;
	navItem?: true;
	auth?: {
		required: boolean;
		hidden: boolean;
	};
	pinned?: boolean;
	show?: (settings: Nullable<PropertySettings>) => boolean;
};

export type PageConfigs = Record<Page, PageConfig>;

export interface PropertySettings {
	app: {
		show: {
			largeFontSelection: boolean;
			miniguide: boolean;
			parentalControls: boolean;
			signin: boolean;
		};
	};

	mainMenu: {
		show: {
			cast: boolean;
			home: boolean;
			onDemand: boolean;
			recordings: boolean;
			search: boolean;
			settings: boolean;
			tvGuide: boolean;
		};
	};
}

export interface CmpResponse<T> {
	code: number;
	message: string;
	response_body: T;
}

export type DishHeaders = Partial<{
	"X-dish-device-id": string; //kept in local storage seperatly to persist sessions.
	"X-dish-app-version": string;
	"X-dish-platform": "browser";
	"X-dish-device-type": string;
	"X-dish-user-agent": string;
	"X-dish-device-ip": string;
	"X-dish-smartbox-id": string;
	"X-dish-modified-smartbox-id": keyof DishHeaders | string;
}>;

export interface Storage {
	get<T>(key: string): Promise<Nullable<T>>;
	set<T>(key: string, value: T): Promise<void>;
	delete(key: string): Promise<void>;
	clear(): Promise<void>;
}

export interface NewRelic {
	setCustomAttribute(key: string, value: Nullable<string>): void;
}

export interface Config {
	env: Environment;
	version: string;
	apiUrl: string;
	cmpApiUrl: string;
	cosmosApiUrl: string;
	storage: Storage;
	platform: Platform;
	newRelic: NewRelic;
	aws: {
		region: string;
		cognito: {
			userPoolId: string;
			identityPoolId: string;
			clientId: string;
		};
		pool: CognitoUserPool;
	};
}

export interface AppState {
	smartbox: { disabled: boolean };
	deviceType: Nullable<string>;
	userAgent: Nullable<string>;
}

export interface AppContext {
	api: Api;
	config: Config;
	state: AppState;
	setState: (setter: (state: AppState) => AppState) => void;
}

export interface Account {
	id: string;
	email: string;
	createdAt: Date;
}

export type User = Account & {
	active: boolean;
	settings: {
		favoritesOnTop: boolean;
	};
	attributes: CognitoUserAttribute[];
	lastLogin: Date;
};

export interface SessionData {
	id: Nullable<string>;
	cognito: ICognitoUserSessionData;
	sessionToken: string;
	user_email: string;
	exp: number;
	toJson(): string;
}

export interface UserSession {
	user: User;
	session: CognitoUserSession;
}

export enum TemperatureFormat {
	Celsius = "°C",
	Fahrenheit = "°F",
}
