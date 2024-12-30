"use client";
import { Navbar } from "@/components/nav/Navbar";
import { Center, Spinner, Switch } from "@/components/utility";
import { Api } from "@/lib/api";
import { useCmp, useEpg, useTheme } from "@/lib/hooks";
import { OnstreamContext } from "@/lib/hooks/useOnstream";
import { AppState, Config } from "@/lib/types";
import React, { useRef } from "react";
import useSWR from "swr";
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
	const theme = useTheme();

	const getSmartboxId = useEpg((state) => state.getSmartboxId);

	const type = property?.type ?? "MDU";

	const context = { config, api: api.current, state, setState };

	const smartboxIdReq = useSWR("smartboxId", () => getSmartboxId(context));

	const propertyReq = useSWR(
		smartboxIdReq.data ? `property/${smartboxIdReq.data}` : null,
		() => getProperty(context, smartboxIdReq.data ?? "")
	);

	return (
		<OnstreamContext.Provider value={{ context, property }}>
			<Switch value={smartboxIdReq.isLoading || propertyReq.isLoading}>
				<Center style={{ width: "100vw", height: "100vh" }}>
					<Spinner size="lg" color={theme.primary} />
				</Center>
				<AppContainer type={type}>
					<Navbar sideNav={type === "MDU"} />
					{children}
				</AppContainer>
			</Switch>
		</OnstreamContext.Provider>
	);
}
