"use client";
import { Navbar } from "@/components/nav";
import { Center, Match, Spinner, Switch } from "@/components/utility";
import { Api } from "@/lib/api";
import { useCmp, useEpg } from "@/lib/hooks";
import { OnstreamContext } from "@/lib/hooks/useOnstream";
import { AppState, Config } from "@/lib/types";
import React, { useRef } from "react";
import useSWR from "swr";
import { ThemeProvider } from "../theme";
import { AppContainer } from "./styles";

type Props = {
	children: React.ReactNode | React.ReactNode[];
	config: Config;
};

export default function Onstream({ children, config }: Props) {
	const api = useRef(new Api());

	const [state, setState] = React.useState<AppState>({
		deviceType: null,
		userAgent: null,
		smartbox: { disabled: false },
	});

	const { property, getProperty } = useCmp();

	const theme = {
		colors: {
			primary: property?.config?.theme.primary ?? "#000",
		},
	};

	const getSmartboxId = useEpg((state) => state.getSmartboxId);

	const type = property?.type ?? "MDU";

	const context = { config, api: api.current, state, setState };

	const smartboxIdReq = useSWR("smartboxId", () => getSmartboxId(context));

	const propertyReq = useSWR(
		smartboxIdReq.data ? `property/${smartboxIdReq.data}` : null,
		() => getProperty(context, smartboxIdReq.data ?? "")
	);

	const isLoading = smartboxIdReq.isLoading || propertyReq.isLoading;

	return (
		<OnstreamContext.Provider value={{ context, property }}>
			<ThemeProvider theme={theme}>
				<Switch>
					<Match when={isLoading}>
						<Center style={{ width: "100vw", height: "100vh" }}>
							<Spinner size="lg" color={theme.colors.primary} />
						</Center>
					</Match>
					<Match when={!isLoading}>
						<AppContainer type={type}>
							<Navbar sideNav={type === "MDU"} />
							{children}
						</AppContainer>
					</Match>
				</Switch>
			</ThemeProvider>
		</OnstreamContext.Provider>
	);
}
