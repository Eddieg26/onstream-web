import { styled } from "@/lib/theme";
import { Icon } from "../elements";

const TopNav = styled("nav", {
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	px: "$8",
	height: "$28",
});

const SideNav = styled("nav", {
	"& .container": {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		height: "$full",
	},

	variants: {
		expanded: {
			true: {
				width: "$screen",
				"& .container": {
					width: "$40",
				},
			},
			false: {
				"& .container": {
					width: "$20",
				},
			},
		},
	},
});

const NavItems = styled("div", {
	display: "flex",
	flexDirection: "row",
	alignItems: "center",

	variants: {
		variant: {
			start: {
				flexGrow: 1,
				"& img": {
					mr: "$8",
					width: "fit-content",
					maxWidth: "96px",
				},
			},
			end: {},
		},
	},
});

const NavLink = styled("a", {
	textDecoration: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",

	variants: {
		sideNav: {
			true: {
				flexDirection: "row",
				width: "$full",
			},
			false: {
				flexDirection: "column",
				height: "$full",
			},
		},
	},
});

const NavIcon = styled(Icon, {
	size: "$8",
});

export const Styles = {
	TopNav,
	SideNav,
	NavItems,
	NavLink,
	NavIcon,
};
