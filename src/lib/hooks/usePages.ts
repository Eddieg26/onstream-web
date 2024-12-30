import { create } from "zustand";
import {
	Nullable,
	Page,
	PageConfig,
	PageConfigs,
	PropertyConfig,
	WidgetType,
} from "../types";

const Pages: PageConfigs = {
	"/": {
		title: "Home",
		navItem: true,
		page: "/",
		show: (settings) => settings?.mainMenu.show.home ?? true,
	},
	watch: {
		title: "Watch",
		navItem: true,
		page: "watch",
	},
	"tv-guide": {
		title: "TV Guide",
		navItem: true,
		show: (settings) => settings?.mainMenu.show.tvGuide ?? true,
		page: "tv-guide",
	},
	"on-demand": {
		title: "On Demand",
		navItem: true,
		page: "on-demand",
		show: (settings) => settings?.mainMenu.show.onDemand ?? true,
	},
	"cast-modal": {
		title: "Cast",
		navItem: true,
		page: "cast-modal",
		show: (settings) => settings?.mainMenu.show.cast ?? true,
	},
	"my-stay": {
		title: "My Stay",
		navItem: true,
		page: "my-stay",
	},
	"community-info": {
		title: "Community Info",
		navItem: true,
		page: "community-info",
	},
	search: {
		title: "Search",
		navItem: true,
		show: (settings) => settings?.mainMenu.show.search ?? true,
		page: "search",
	},
	"hotel-info": {
		title: "Hotel Info",
		navItem: true,
		page: "hotel-info",
	},
	recordings: {
		title: "Recordings",
		navItem: true,
		page: "recordings",
	},
	"sign-in": {
		title: "Sign In",
		auth: { required: false, hidden: true },
		navItem: true,
		pinned: true,
		page: "sign-in",
	},
	"sign-up": {
		title: "Sign Up",
		auth: { required: false, hidden: true },
		page: "sign-up",
	},
	player: {
		title: "Live Player",
		page: "player",
	},
	settings: {
		title: "Settings",
		navItem: true,
		page: "settings",
		show: (settings) => settings?.mainMenu.show.settings ?? true,
	},
	"settings/app": {
		title: "Settings App",
		page: "settings",
	},
	"settings/account": {
		title: "Account",
		page: "settings/account",
	},
	"settings/faqs": {
		title: "Faqs",
		page: "settings/faqs",
	},
	"settings/legal": {
		title: "Legal & About",
		page: "settings/legal",
	},
	"settings/privacy": {
		title: "Privacy Policy",
		page: "settings/privacy",
	},
	"settings/terms": {
		title: "Terms of Service",
		page: "settings/terms",
	},
	"settings/parental": {
		title: "Parental Controls",
		auth: { required: true, hidden: false },
		page: "settings/parental",
	},
	"settings/temperature": {
		title: "Temperature",
		page: "settings/temperature",
	},
	"settings/time": {
		title: "Time",
		page: "settings/time",
	},
	sports: {
		title: "Sports",
		page: "sports",
	},
	seeall: {
		title: "See All",
		page: "seeall",
	},
	"seeall/ondemand/popular-shows": {
		title: "See all On Demand",
		page: "seeall/ondemand/popular-shows",
	},
	"seeall/ondemand/popular-movies": {
		title: "See all On Demand",
		page: "seeall/ondemand/popular-movies",
	},
	"seeall/sports/nfl": {
		title: "See all Sports NFL",
		page: "seeall/sports/nfl",
	},
	"seeall/sports/nhl": {
		title: "See all Sports NHL",
		page: "seeall/sports/nhl",
	},
	"seeall/sports/nba": {
		title: "See all Sports NBA",
		page: "seeall/sports/nba",
	},
	"seeall/sports/mlb": {
		title: "See all Sports MLB",
		page: "seeall/sports/mlb",
	},
	"seeall/home/category": {
		title: "See all",
		page: "seeall/home/category",
	},
	devtools: {
		title: "Dev Tools",
		page: "devtools",
	},
	preview: {
		title: "Preview",
		page: "preview",
	},
	404: {
		title: "404",
		page: "404",
	},
};

export type PageFilter = {
	pages: PageConfigs;
	hidden: {
		pages: Page[];
		widgets: WidgetType[];
	};

	getPage: (page: Page) => PageConfig;
	showPage: (page: Page) => boolean;
	showWidget: (widget: WidgetType) => boolean;
	update: (
		property: Nullable<PropertyConfig>,
		authenticated?: boolean
	) => void;
};

export const usePageFilter = create<PageFilter>((set, get) => ({
	pages: Pages,
	hidden: {
		pages: [],
		widgets: [],
	},

	getPage: (page) => {
		return get().pages[page];
	},

	showPage: (page) => {
		const state = get();
		return !state.hidden.pages.includes(page);
	},

	showWidget: (widget) => {
		const state = get();
		return !state.hidden.widgets.includes(widget);
	},

	update(property, authenticated: boolean = false) {
		const pages = get().pages;
		const hiddenPages = Object.keys(pages).filter((page) => {
			const config = pages[page as Page];
			return (
				(!authenticated && config.auth?.required) ||
				(config.show && !config.show(property?.settings))
			);
		}) as Page[];

		set({ hidden: { pages: hiddenPages, widgets: [] } });
	},
}));
