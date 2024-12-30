import React from "react";
import { create } from "zustand";
import { Request } from "../api";
import { AppContext, DishHeaders, Nullable, Property } from "../types";
import { createConfig } from "../utils";

type OnstreamClient = {
    headers: DishHeaders;
    interceptor: (request: Request) => Promise<Request>;
    setSmartboxId: (
        ctx: AppContext,
        smartboxId: string,
        qaCmpProfile: Nullable<string>
    ) => void;
    setHeaders: (ctx: AppContext, headers: DishHeaders) => void;
};

export const useClient = create<OnstreamClient>((set) => ({
    config: createConfig({}),
    headers: {} as DishHeaders,
    interceptor: interceptHeaders({} as DishHeaders),

    setSmartboxId: (
        ctx: AppContext,
        smartboxId: string,
        qaCmpProfile: Nullable<string>
    ) => {
        set((state) => {
            state.setHeaders(ctx, {
                "X-dish-smartbox-id": smartboxId,
                "X-dish-modified-smartbox-id": qaCmpProfile ?? smartboxId,
            });

            ctx.config.newRelic.setCustomAttribute(
                "X-dish-device-id",
                state.headers["X-dish-device-id"]
            );

            ctx.config.newRelic.setCustomAttribute(
                "X-dish-app-version",
                ctx.config.version
            );

            ctx.config.newRelic.setCustomAttribute(
                "X-dish-platform",
                state.headers["X-dish-platform"]
            );

            ctx.config.newRelic.setCustomAttribute(
                "X-dish-device-type",
                ctx.state.deviceType
            );

            ctx.config.newRelic.setCustomAttribute(
                "X-dish-user-agent",
                ctx.state.userAgent
            );

            ctx.config.newRelic.setCustomAttribute(
                "X-dish-smartbox-id",
                smartboxId
            );

            ctx.config.newRelic.setCustomAttribute("SmartBoxId", smartboxId);

            ctx.config.newRelic.setCustomAttribute(
                "X-dish-modified-smartbox-id",
                qaCmpProfile ?? smartboxId
            );

            return state;
        });
    },

    setHeaders: (ctx: AppContext, headers: DishHeaders) => {
        set((state) => {
            for (const _key in headers) {
                const key = _key as keyof DishHeaders;
                if (headers[key] === null) {
                    delete state.headers[key];
                } else {
                    state.headers[key] = headers[key] as any;
                }
            }

            ctx.api.interceptors.request.remove(state.interceptor);
            state.interceptor = interceptHeaders(state.headers);
            ctx.api.interceptors.request.use(state.interceptor);

            return state;
        });
    },
}));

export const OnstreamContext = React.createContext({
    context: {} as AppContext,
    property: null as Nullable<Property>,
});

export function useOnstream() {
    const { context, property } = React.useContext(OnstreamContext);
    const client = useClient();

    return { context, client, property };
}

function interceptHeaders(headers: DishHeaders) {
    return async (request: Request) => {
        if (
            request.url.includes("https://cmp") ||
            request.url.includes("dishonstream-client-api") ||
            request.url.includes("dishonstream-cosmos-api")
            // smartBoxAndSESPattern.test(req.url) //!SES and Smartbox (ATX)need to update preflight CORS to accept first. //Needs Regex to account for different streaming blades. i.e. streaming0, streaming1, etc.
        ) {
            request.headers = {
                ...request.headers,
                ...headers,
            };
        }

        return request;
    };
}
