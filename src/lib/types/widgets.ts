import { AppContext, Nullable } from ".";
import { Recording } from "./recording";
import { GameStatus, SportLeague, SportStats, SportTeam } from "./sports";

export enum TileSize {
	SwimlaneSmall = "swimlane--small",
	SwimlaneLarge = "swimlane--large",
	Carousel = "carousel",
	HeroLarge = "hero--large",
	VerticalColumnSmall = "vertical-column--small",
	VerticalColumnLarge = "vertical-column--large",
}

export type HeroType = "main" | "sub";

export type WidgetType =
	| "live"
	| "more-info"
	| "weather"
	| "sports"
	| "notification"
	| "video"
	| "ad"
	| "deep-link"
	| "full-page"
	| "error"
	| "game"
	| "see-all"
	| "on-demand"
	| "dvr";

export const WidgetTypeMap: Record<WidgetType, string> = {
	live: "widget--live-channel",
	"more-info": "widget--more-info",
	weather: "widget--weather",
	sports: "widget--sports",
	notification: "widget--notification",
	video: "widget--more-info-video",
	ad: "widget--static-ad",
	"deep-link": "widget--deep-link",
	"full-page": "widget--more-info-full-page-takeover",
	error: "widget--error",
	game: "widget--game",
	"see-all": "widget--see-all",
	"on-demand": "widget--on-demand",
	dvr: "widget--dvr",
} as const;

export type WidgetMeta = {
	id?: string;
	publishedFrom?: number;
	typeId?: string;
	type: WidgetType;
};

export interface DeepLinkWidgetData {
	title: string;
	icon: string;
	linkText: string;
	image: string;
	json: any;
	size: TileSize;
	meta: WidgetMeta;
}

export interface LiveWidgetData {
	title: string;
	live: boolean;
	channelId: number;
	size: TileSize;
	meta: WidgetMeta;
}

export interface MoreInfoWidgetData {
	title: string;
	bodyText: string;
	headline: string;
	heroImage: string;
	icon: string;
	link: string;
	subHeading: string;
	meta: WidgetMeta;
}

export interface SportsWidgetData {
	title: string;
	meta: WidgetMeta;
}

export interface WeatherWidgetData {
	title: string;
	meta: WidgetMeta;
}

export interface NotificationWidgetData {
	title: string;
	bodyText: string;
	headline: string;
	icon: string;
	link: string;
	meta: WidgetMeta;
}

export interface VideoWidgetData {
	title: string;
	bodyText: string;
	headline: string;
	icon: string;
	link: string;
	posterImage: string;
	subHeading: string;
	videoBackground: string;
	size: TileSize;
	meta: WidgetMeta;
}

export interface AdWidgetData {
	title: string;
	adHeroImage: string;
	bodyText: string;
	headline: string;
	icon: string;
	link: string;
	subHeading: string;
	size: TileSize;
	meta: WidgetMeta;
}

export type WidgetData =
	| LiveWidgetData
	| MoreInfoWidgetData
	| WeatherWidgetData
	| SportsWidgetData
	| NotificationWidgetData
	| VideoWidgetData
	| AdWidgetData
	| DeepLinkWidgetData
	| OnDemandWidgetData
	| SeeAllWidgetData
	| DvrWidgetData
	| GameWidgetData;

export interface OnDemandWidgetData {
	id: string;
	content_type: string;
	title?: string;
	released_on: string;
	poster_url: string;
	service_groups: number[];
	slug: string;
	meta: WidgetMeta;
}

export type OnDemandSearchResult = Omit<OnDemandWidgetData, "meta">;

export interface SeeAllWidgetData {
	swimlaneInfo: {
		type: string;
		category: string;
	};
	meta: WidgetMeta;
}

export interface DvrWidgetData extends Recording {
	meta: WidgetMeta;
}

export interface GameWidgetData<Stats extends SportStats = SportStats> {
	displayTime: string;
	echoId: string[];
	gameStatus: GameStatus;
	homeTeam: SportTeam;
	awayTeam: SportTeam;
	homeStats: Nullable<Stats>;
	awayStats: Nullable<Stats>;
	id: number;
	key: number;
	league: SportLeague;
	scheduledDate: string;
	providerCallsign: string;
	period: string;
	venue: string;
	meta: WidgetMeta;
}

export type ContainerType =
	| "hero-carousel"
	| "ad-carousel"
	| "swimlane--widgets"
	| "swimlane--widgets-large";

export const ContainerMap: Record<ContainerType, string> = {
	"hero-carousel": "Hero Carousel",
	"ad-carousel": "Ad Carousel",
	"swimlane--widgets": "Swimlane",
	"swimlane--widgets-large": "Swimlane Large",
};

export type ContainerMeta = Partial<{
	id: string;
	publishedFrom: number;
	type: string;
	typeId: string;
}>;

export interface ContainerLayout<T extends WidgetData = WidgetData> {
	title: string;
	items: T[];
	category?: string;
	size?: TileSize;
	meta: ContainerMeta;
}

type SwimlaneProps = {
	tileSize: TileSize;
	variant: "swimlane";
};

type HeroProps = {
	type: HeroType;
	variant: "hero";
};

export interface WidgetProps<T extends WidgetData = WidgetData> {
	widget: T;
	context: AppContext;
	container: { variant: "none" } | SwimlaneProps | HeroProps;
}
