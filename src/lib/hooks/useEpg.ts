import { map, tryit } from "radash";
import { create } from "zustand";
import { AppContext, Channel, Nullable, Program } from "../types";

export type Epg = {
    smartboxId: Nullable<string>;
    channels: Channel[];
    genres: string[];
    getSmartboxId: (ctx: AppContext) => Promise<string>;
    getChannels: (ctx: AppContext) => Promise<Channel[]>;
};

export const useEpg = create<Epg>((set, get) => ({
    smartboxId: null,
    channels: [],
    genres: [],
    getSmartboxId: async (ctx: AppContext) => {
        type SmartboxId = { SMARTBOXIdentifier: string };
        const url =
            "https://streaming0.watchdishtv.com/serviceepginterface/identifier";

        let smartboxId = (await ctx.api.get<SmartboxId>(url))
            .SMARTBOXIdentifier;
        const qaCmpProfile = await ctx.config.storage.get<string>(
            "qaCmpProfile"
        );
        if (qaCmpProfile) {
            smartboxId = qaCmpProfile;
        }

        set({ smartboxId });

        return smartboxId;
    },

    getChannels: async (ctx: AppContext) => {
        const state = get();
        if (ctx.state.smartbox.disabled) return [];

        let url =
            "https://streaming0.watchdishtv.com/serviceepginterface/serviceepgdata";
        const schedule = filterSchedule(
            await ctx.api.get<ChannelSchedule>(url)
        );
        const programMap = new Map<string, ChannelProgram>();
        schedule.forEach((service, channel) =>
            service.events.forEach((event, index) => {
                programMap.set(event.echostarId, { ...event, channel, index });
            })
        );

        url = state.smartboxId
            ? `${ctx.config.cosmosApiUrl}/api/metadata/bulkprograms?smartBoxId=${state.smartboxId}`
            : `${ctx.config.cosmosApiUrl}/api/metadata/bulkprograms`;

        const genres = new Set<string>();
        const programRecord = await ctx.api.post<ProgramRecord>(url, schedule);
        const channels = await map(schedule, async (service) => {
            const url = `${ctx.config.cosmosApiUrl}/api/metadata/channel-logo/${service.serviceKey}`;
            const [, logo] = await tryit(ctx.api.get<{ logo_url: string }>)(
                url
            );
            return {
                id: service.serviceKey,
                name: service.serviceName,
                contentId: service.contentID,
                dashUrl: service.serviceUrlDASH,
                hlsUrl: service.serviceUrlHLS,
                programs: service.events.map((event) => {
                    const record = programRecord[event.echostarId];
                    const program = parseProgram(record, programMap, service);
                    program.genres.forEach(genres.add);
                    return program;
                }),
                logo: logo?.logo_url ?? "",
            } as Channel;
        });

        set({ genres: Array.from(genres), channels });

        return channels;
    },
}));

interface ChannelService {
    numberOfEvents: number;
    serviceKey: number;
    serviceName?: string;
    contentID: string;
    serviceUrlHLS: string;
    serviceUrlDASH: string;
    events: ProgramEvent[];
}

interface ProgramEvent {
    eventName: string;
    startTime: string;
    duration: number;
    echostarId: string;
}

interface ChannelSchedule {
    numberOfServices: number;
    services: ChannelService[];
}

type ChannelProgram = ProgramEvent & { channel: number; index: number };

type ProgramRecord = {
    [k: string]: Program | ProgramEvent;
};

function parseProgram(
    program: Program | ProgramEvent,
    programs: Map<string, ChannelProgram>,
    channel: ChannelService
): Program {
    if (program.eventName == undefined) {
        const event = programs.get(program.echostarId) as ProgramEvent;
        return {
            ...program,
            startTime: Date.parse(event.startTime),
            endTime: Date.parse(event.startTime) + program.duration,
            duration: program.duration,
        };
    } else {
        return {
            title: program.eventName,
            description: program.eventName,
            echostarId: program.echostarId,
            startTime: Date.parse(program.startTime),
            endTime: Date.parse(program.startTime) + program.duration * 1000,
            duration: program.duration,
            genres: [],
            channel: {
                id: channel.serviceKey.toString(),
                name: channel.serviceName || "",
                content: channel.contentID,
            },
        } as unknown as Program;
    }
}

function filterSchedule(channels: ChannelSchedule): ChannelService[] {
    return channels.services.filter((channel) => {
        channel.events = channel.events.filter((event) => {
            const eventEnd =
                Date.parse(event.startTime) + event.duration * 1000;
            return eventEnd > Date.now();
        });

        channel.numberOfEvents = channel.events.length;
        channel.events.sort(
            (a, b) => Date.parse(a.startTime) - Date.parse(b.startTime)
        );

        return channel.numberOfEvents > 0;
    });
}
