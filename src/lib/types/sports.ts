import { Nullable } from ".";

export enum GameStatus {
    UPCOMING = "UPCOMING",
    COMPLETED = "COMPLETED",
    IN_PROGRESS = "IN_PROGRESS",
    CANCELLED = "CANCELLED",
}

export type SportLeague = "nba" | "mlb" | "nfl" | "nhl";

export interface SportTeam {
    img: string;
    name: string;
}

export interface NFLStats {
    type: SportLeague;
    firstDowns: number;
    thirdDownEfficiency: number;
    fourthDownEfficiency: number;
    totalPlays: number;
    totalSacks: number;
    totalPunts: number;
    totalPenalties: number;
    fumblesLost: number;
    interceptionsAttempted: number;
    possesionTime: string;
    yards: {
        passing: number;
        rushing: number;
        penalty: number;
        perPlay: number;
        total: number;
    };
}

export interface NHLStats {
    type: SportLeague;
    shots: number;
    powerplay: {
        attempts: number;
        goals: number;
    };
    shootout: {
        attempts: number;
        score: number;
    };
}

export interface NBAStats {
    type: SportLeague;
    secondChancePoints: number;
    fieldGoalAttempted: number;
    fieldGoalMade: number;
    fieldGoalPercent: number;
    assists: number;
    biggestLead: number;
    blocks: number;
    fastBreakPoints: number;
    flagrantFouls: number;
    fouls: number;
    freeThrowsAttempted: number;
    freeThrowsMade: number;
    freeThrowPercent: number;
    points: number;
    pointsInPaint: number;
    pointsOffTurnover: number;
    reboundsDefensive: number;
    reboundsOffensive: number;
    steals: number;
    turnovers: number;
}

export interface MLBStats {
    type: SportLeague;
    bats: number;
    doublePlays: number;
    errors: number;
    hits: number;
    probablePitcher: string;
    rbi: number;
    runnersLeftOnBase: number;
    runs: number;
    scoringOppurtunities: number;
    scoringSuccesses: number;
    strikeOuts: number;
    sumBatterLeftOnBase: number;
    totalBases: number;
    triplePlays: number;
    walks: number;
}

export type RawStats = {
    [K: string | number | symbol]: string | number | symbol;
};

export type SportStats = NFLStats | NHLStats | NBAStats | MLBStats;

export interface GameStats<T extends SportStats = SportStats> {
    homeTeam: { score: number; stats: Nullable<T> };
    awayTeam: { score: number; stats: Nullable<T> };
}

export interface RawGameStats {
    homeTeam: { score: string; stats: RawStats };
    awayTeam: { score: string; stats: RawStats };
}

export interface GameProgram {
    gameId: number;
    channelId: number;
    channelName: string;
    duration: number;
    echostarId: string;
    eventName: string;
    startTime: number;
    endTime: number;
}
