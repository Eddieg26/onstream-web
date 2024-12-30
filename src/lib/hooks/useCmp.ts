import { map } from "radash";
import { create } from "zustand";
import {
    AppContext,
    CmpResponse,
    ContainerLayout,
    GameWidgetData,
    MLBStats,
    NBAStats,
    NFLStats,
    NHLStats,
    Nullable,
    PageLayout,
    Property,
    PropertyConfig,
    RawGameStats,
    RawStats,
    SportLeague,
    SportStats,
    TileSize,
    WeatherData,
} from "../types";

export type Cmp = {
	property: Nullable<Property>;
	getProperty: (
		ctx: AppContext,
		smartboxId: string,
		platform?: Nullable<string>
	) => Promise<Property>;
	getPageLayout: (
		ctx: AppContext,
		element: string,
		preview?: boolean
	) => Promise<PageLayout>;
	getGameWidgets: (
		ctx: AppContext,
		league: Nullable<SportLeague>
	) => Promise<ContainerLayout<GameWidgetData>[]>;
	getWeather: (
		ctx: AppContext,
		image?: Nullable<string>,
		zipcode?: Nullable<string>
	) => Promise<Nullable<WeatherData>>;
};

export const useCmp = create<Cmp>((set, get) => ({
	property: null,
	getProperty: async (
		ctx: AppContext,
		smartboxId: string,
		platform: Nullable<string> = null
	) => {
		let url = `${ctx.config.cmpApiUrl}/cmp/cmp_api/property?smartboxId=${smartboxId}`;
		console.log("URL", url);
		const propertyResponse = await ctx.api.get<
			CmpResponse<PropertyResponse>
		>(url);
		const property = propertyResponse.response_body;

		const _platform = platform
			? `?platform=${platform}`
			: `?platform=${ctx.config.platform}`;
		url = `${ctx.config.cmpApiUrl}/cmp/cmp_api/v2/property/${property.id}/configuration${_platform}`;

		const configResponse = await ctx.api.get<CmpResponse<PropertyConfig>>(
			url
		);

		const fullProperty = {
			...property,
			config: configResponse.response_body,
		};

		set({ property: fullProperty });

		return fullProperty;
	},

	getPageLayout: async (
		ctx: AppContext,
		element: string,
		preview: boolean = false
	) => {
		const template = preview ? "preview" : "template";
		const url = `${ctx.config.cmpApiUrl}/cmp/cmp_api/${template}/${element}`;
		const response = await ctx.api.get<CmpResponse<PageLayout>>(url);
		const swimlane = formatSwimlane(response.response_body, preview);

		return {
			items: swimlane,
			meta: response.response_body.meta,
			platform: response.response_body.platform,
			title: response.response_body.title,
		} as PageLayout;
	},

	getGameWidgets: async (
		ctx: AppContext,
		league: Nullable<SportLeague> = null
	) => {
		const url = `${ctx.config.apiUrl}/api/sports/get-sports`;
		const opts = { headers: { "route-version": "2" } };
		const response = await ctx.api.get<GamesResponse>(url, opts);
		const leagues = league
			? [league]
			: (Object.keys(response.result) as SportLeague[]);

		const swimlanes = await map(leagues, async (league) => {
			const widgets = await map(
				response.result[league],
				async (widget) => {
					const url = `${ctx.config.cmpApiUrl}/api/stats/${widget.id}`;
					const stats = await ctx.api.get<RawGameStats>(url);
					widget.homeStats = stats.homeTeam.stats
						? parseStats(stats.homeTeam.stats, league)
						: null;
					widget.awayStats = stats.awayTeam.stats
						? parseStats(stats.awayTeam.stats, league)
						: null;
					return widget;
				}
			);

			return {
				type: "sports",
				category: league,
				title: league.toUpperCase(),
				size: TileSize.SwimlaneSmall,
				items: widgets,
				meta: {
					publishedFrom: 0,
					type: "sports",
					typeId: "sports",
					__type: "custom",
				},
			} as ContainerLayout<GameWidgetData>;
		});

		return swimlanes;
	},

	getWeather: async (
		ctx: AppContext,
		image: Nullable<string> = null,
		zipcode: Nullable<string> = null
	) => {
		const state = get();
		const code = zipcode ?? state.property?.config.zipCode;
		if (!code) return null;

		const url = `${ctx.config.apiUrl}/api/weather/${code}`;
		const data = await ctx.api.get<WeatherData>(url);
		data.observation.ob.imageUrl = getImageUrl(
			image ?? "",
			data.observation.ob.icon
		);

		data.forecastday.forEach(
			(day) => (day.imageUrl = getImageUrl(image ?? "", day.icon))
		);

		return data;
	},
}));

export function selectProperty(state: Cmp) {
	return state.property;
}

export function useTheme() {
	const property = useCmp(selectProperty);

	return (
		property?.config?.theme ?? {
			primary: "#f01446",
		}
	);
}

type PropertyResponse = Omit<Property, "config">;

type GamesResponse = {
	message: string;
	result: { [K in SportLeague]: GameWidgetData[] };
};

function getImageUrl(baseImageUrl: string, icon: string) {
	return `${baseImageUrl}/${icon}`.replace("http://", "https://");
}

export function formatSwimlane(
	layout: PageLayout,
	preview = false
): ContainerLayout[] {
	return [];
}

export function parseNflStats(stats: RawStats): NFLStats {
	return {
		type: "nfl",
		passingYards: Number(stats.passing_netYards),
		rushingYards: Number(stats.rushing_yards),
		yards: {
			perPlay:
				Math.ceil(
					(Number(stats.gameTotals_netYards) /
						Number(stats.gameTotals_plays)) *
						10
				) / 10,
			penalty: Number(stats.penalties_yards),
			passing: Number(stats.passing_netYards),
			rushing: Number(stats.rushing_yards),
			total: Number(stats.passing_netYards) + Number(stats.rushing_yards),
		},
		firstDowns: Number(stats.firstDowns_number),
		thirdDownEfficiency: Number(stats.thirdDownEfficiency_percent),
		fourthDownEfficiency: Number(stats.fourthDownEfficiency_percent),
		totalPlays: Number(stats.gameTotals_plays),
		totalSacks: Number(stats.passing_sacked),
		totalPunts: Number(stats.punting_punts),
		totalPenalties: Number(stats.penalties_number),
		fumblesLost: Number(stats.fumbles_lost),
		interceptionsAttempted: Number(stats.interceptionReturn_attempts),
		possesionTime: `${String(stats.timeOfPossession_minutes)}:${String(
			stats.timeOfPossession_seconds
		)}`,
	} as NFLStats;
}

export function parseNbaStats(stats: RawStats): NBAStats {
	return {
		type: "nba",
		secondChancePoints: Number(stats["2ndChancePoints"]),
		fieldGoalAttempted: Number(stats.fgAttempted),
		fieldGoalMade: Number(stats.fgMade),
		fieldGoalPercent: Number(stats.fgPct),
		assists: Number(stats.assists),
		biggestLead: Number(stats.biggestLead),
		blocks: Number(stats.blocks),
		fastBreakPoints: Number(stats.fastBreakPts),
		flagrantFouls: Number(stats.flagrantFouls),
		fouls: Number(stats.fouls),
		freeThrowsAttempted: Number(stats.ftAttempted),
		freeThrowsMade: Number(stats.ftMade),
		freeThrowPercent: Number(stats.ftPct),
		points: Number(stats.points),
		pointsInPaint: Number(stats.ptsInPaint),
		pointsOffTurnover: Number(stats.ptsOffTurnovers),
		reboundsDefensive: Number(stats.reboundsDefensive),
		reboundsOffensive: Number(stats.reboundsOffensive),
		steals: Number(stats.steals),
		turnovers: Number(stats.turnovers),
	} as NBAStats;
}

export function parseNhlStats(stats: RawStats): NHLStats {
	return {
		shots: Number(stats.shots),
		powerplay: {
			attempts: Number(stats.powerplay_attempts),
			goals: Number(stats.powerplay_goals),
		},
		shootout: {
			attempts: Number(stats.shootoutAttempts),
			score: Number(stats.shootoutScore),
		},
	} as NHLStats;
}

export function parseMlbStats(stats: RawStats): MLBStats {
	return {
		bats: Number(stats.bats),
		doublePlays: Number(stats.doublePlays),
		errors: Number(stats.errors),
		hits: Number(stats.hits),
		probablePitcher: String(stats.probable_pitcher),
		rbi: Number(stats.rbi),
		runnersLeftOnBase: Number(stats.runnersLeftOnBase),
		runs: Number(stats.runs),
		scoringOppurtunities: Number(stats.scoringOppurtunities),
		scoringSuccesses: Number(stats.scoringSuccesses),
		strikeOuts: Number(stats.strikeOuts),
		sumBatterLeftOnBase: Number(stats.sumBatterLeftOnBase),
		totalBases: Number(stats.totalBases),
		triplePlays: Number(stats.triplePlays),
		walks: Number(stats.walks),
	} as MLBStats;
}

export function parseStats(
	stats: RawStats,
	league: SportLeague
): Nullable<SportStats> {
	switch (league) {
		case "nfl":
			return parseNflStats(stats);
		case "nba":
			return parseNbaStats(stats);
		case "nhl":
			return parseNhlStats(stats);
		case "mlb":
			return parseMlbStats(stats);
		default:
			return null;
	}
}
