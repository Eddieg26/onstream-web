import { styled } from "@/lib/theme";

export const AppContainer = styled("div", {
	display: "flex",
	width: "100%",
	height: "100%",

	variants: {
		type: {
			MDU: {
				flexDirection: "column",
			},
			Hospitality: {
				flexDirection: "row",
			},
		},
	},
});
