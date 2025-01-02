import { Nullable } from "@/lib/types";
import { uid } from "radash";
import React, { useEffect } from "react";

const SwitchContext = React.createContext({
	value: { current: "" as Nullable<string> },
});

type Props = {
	children: React.ReactNode;
	fallback?: React.ReactNode;
};
export function Switch({ children, fallback }: Props) {
	const value = React.useRef<Nullable<string>>(null);

	return (
		<SwitchContext.Provider value={{ value }}>
			{value ? children : fallback || null}
		</SwitchContext.Provider>
	);
}

export function Match({
	when,
	children,
}: {
	when: boolean;
	children: React.ReactNode;
}) {
	const context = React.useContext(SwitchContext);
	const id = React.useRef(uid(10));

	useEffect(() => {
		if (when && !context.value.current) {
			context.value.current = id.current;
		}
	}, [context, when]);

	return context.value.current === id.current ? <>{children}</> : null;
}
