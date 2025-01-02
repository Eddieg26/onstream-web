import { createStitches } from "@stitches/react";
import { createContext } from "react";

const Sizes = {
	"0": "0px",
	px: "1px",
	"0.5": "0.125rem",
	"1": "0.25rem",
	"1.5": "0.375rem",
	"2": "0.5rem",
	"2.5": "0.625rem",
	"3": "0.75rem",
	"3.5": "0.875rem",
	"4": "1rem",
	"5": "1.25rem",
	"6": "1.5rem",
	"7": "1.75rem",
	"8": "2rem",
	"9": "2.25rem",
	"10": "2.5rem",
	"12": "3rem",
	"14": "3.5rem",
	"16": "4rem",
	"20": "5rem",
	"24": "6rem",
	"28": "7rem",
	"32": "8rem",
	"36": "9rem",
	"40": "10rem",
	"44": "11rem",
	"48": "12rem",
	"52": "13rem",
	"56": "14rem",
	"60": "15rem",
	"64": "16rem",
	"72": "18rem",
	"80": "20rem",
	"96": "24rem",
	full: "100%",
	screen: "100vw",
	"1/2": "50%",
	"1/3": "33.333333%",
	"2/3": "66.666667%",
	"1/4": "25%",
	"2/4": "50%",
	"3/4": "75%",
	"1/5": "20%",
	"2/5": "40%",
	"3/5": "60%",
	"4/5": "80%",
	"1/6": "16.666667%",
	"2/6": "33.333333%",
	"3/6": "50%",
	"4/6": "66.666667%",
	"5/6": "83.333333%",
	"1/12": "8.333333%",
	"2/12": "16.666667%",
	"3/12": "25%",
	"4/12": "33.333333%",
	"5/12": "41.666667%",
	"6/12": "50%",
	"7/12": "58.333333%",
	"8/12": "66.666667%",
	"9/12": "75%",
	"10/12": "83.333333%",
	"11/12": "91.666667%",
	fit: "fit-content",
	min: "min-content",
	max: "max-content",
};

const FontSizes = {
	xs: "0.75rem",
	sm: "0.875rem",
	base: "1rem",
	lg: "1.125rem",
	xl: "1.25rem",
	"2xl": "1.5rem",
	"3xl": "1.875rem",
	"4xl": "2.25rem",
	"5xl": "3rem",
	"6xl": "4rem",
	"7xl": "5rem",
	"8xl": "6rem",
	"9xl": "8rem",
};

export type FontSize = keyof typeof FontSizes;

const FontWeights = {
	thin: "100",
	extralight: "200",
	light: "300",
	normal: "400",
	medium: "500",
	semibold: "600",
	bold: "700",
	extrabold: "800",
	black: "900",
};

export type FontWeight = keyof typeof FontWeights;

const LineHeights = {
	none: "1",
	tight: "1.25",
	snug: "1.375",
	normal: "1.5",
	relaxed: "1.625",
	loose: "2",
};

export type LineHeight = keyof typeof LineHeights;

const LetterSpacings = {
	tighter: "-0.05em",
	tight: "-0.025em",
	normal: "0",
	wide: "0.025em",
	wider: "0.05em",
	widest: "0.1em",
};

export type LetterSpacing = keyof typeof LetterSpacings;

const BorderWidths = {
	none: "0",
	sm: "1px",
	md: "2px",
	lg: "4px",
};

export const BaseTheme = createStitches({
	theme: {
		colors: {
			primary: "hsl(200, 100%, 50%)",
			"bg-base-100": "hsl(0, 0%, 98%)",
			"bg-base-200": "hsl(0, 0%, 96%)",
			"bg-base-300": "hsl(0, 0%, 94%)",
			"bg-base-400": "hsl(0, 0%, 92%)",
			"bg-base-500": "hsl(0, 0%, 90%)",
			"bg-base-600": "hsl(0, 0%, 88%)",
			"bg-base-700": "hsl(0, 0%, 86%)",
			"bg-base-800": "hsl(0, 0%, 84%)",
			"bg-base-900": "hsl(0, 0%, 82%)",
		},
		space: Sizes,
		fontSizes: FontSizes,
		fonts: {
			untitled: "Untitled Sans, apple-system, sans-serif",
			mono: "Söhne Mono, menlo, monospace",
		},
		fontWeights: FontWeights,
		lineHeights: LineHeights,
		letterSpacings: LetterSpacings,
		sizes: Sizes,
		borderWidths: BorderWidths,
		borderStyles: {
			none: "none",
			dotted: "dotted",
			dashed: "dashed",
			solid: "solid",
			double: "double",
			groove: "groove",
			ridge: "ridge",
			inset: "inset",
			outset: "outset",
		},
		radii: {
			none: "0",
			sm: "0.125rem",
			md: "0.25rem",
			lg: "0.5rem",
			full: "9999px",
		},
		shadows: {},
		zIndices: {},
		transitions: {},
	},
	media: {
		desktop: "(min-width: 1280px)",
		"tablet-lg": "(min-width: 1024px) and (max-width: 1279px)",
		tablet: "(min-width: 768px) and (max-width: 1023px)",
		"mobile-lg": "(min-width: 640px) and (max-width: 767px)",
		mobile: "(max-width: 639px)",
		landscape: "(orientation: landscape)",
		portrait: "(orientation: portrait)",
	},
	utils: {
		px: (value: `$${keyof typeof Sizes}`) => ({
			paddingLeft: value,
			paddingRight: value,
		}),
		py: (value: `$${keyof typeof Sizes}`) => ({
			paddingTop: value,
			paddingBottom: value,
		}),
		mx: (value: `$${keyof typeof Sizes}`) => ({
			marginLeft: value,
			marginRight: value,
		}),
		my: (value: `$${keyof typeof Sizes}`) => ({
			marginTop: value,
			marginBottom: value,
		}),
		br: (value: `$${keyof typeof BorderWidths}`) => ({
			borderRadius: value,
		}),
		size: (value: `$${keyof typeof Sizes}`) => ({
			width: value,
			height: value,
		}),
	},
});

export type Theme = {
	colors: {
		primary: string;
	};
};

export type ThemeConfig = ReturnType<typeof BaseTheme.createTheme>;

export function createTheme(value: Theme) {
	return BaseTheme.createTheme(value);
}

export const ThemeContext = createContext<{ theme: Theme }>({
	theme: { colors: { primary: "hsl(200, 100%, 50%)" } },
});

export const { styled, css, keyframes, getCssText, theme } = BaseTheme;
