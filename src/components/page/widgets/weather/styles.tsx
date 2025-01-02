import { styled } from "@/lib/theme";

export const Styles = {
	FlexRow: styled("div", {
		display: "flex",
		flexDirection: "row",
	}),
	Logo: styled("div", {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		"& img": {
			width: "100px",
			height: "100px",
		},
		variants: {
			show: {
				true: { display: "flex" },
				false: { display: "none" },
			},
		},
	}),
};
