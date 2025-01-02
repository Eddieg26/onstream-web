import { styled } from "@/lib/theme";

const Weights = {
	thin: { fontWeight: "100" },
	extralight: { fontWeight: "200" },
	light: { fontWeight: "300" },
	normal: { fontWeight: "400" },
	medium: { fontWeight: "500" },
	semibold: { fontWeight: "600" },
	bold: { fontWeight: "700" },
	extrabold: { fontWeight: "800" },
	black: { fontWeight: "900" },
};

const LineHeights = {
	none: { lineHeight: "1" },
	tight: { lineHeight: "1.25" },
	snug: { lineHeight: "1.375" },
	normal: { lineHeight: "1.5" },
	relaxed: { lineHeight: "1.625" },
	loose: { lineHeight: "2" },
};

const Spacings = {
	xs: { fontSize: "0.75rem" },
	sm: { fontSize: "0.875rem" },
	base: { fontSize: "1rem" },
	lg: { fontSize: "1.125rem" },
	xl: { fontSize: "1.25rem" },
};

export const TextBody = styled("span", {
	variants: {
		size: {
			xs: { fontSize: "0.75rem" },
			sm: { fontSize: "0.875rem" },
			base: { fontSize: "1rem" },
			lg: { fontSize: "1.125rem" },
			xl: { fontSize: "1.25rem" },
		},
		weight: Weights,
		lineHeight: LineHeights,
		spacing: Spacings,
	},
});

export const TextHeader = styled("h1", {
	variants: {
		size: {
			xs: { fontSize: "1.875rem" },
			sm: { fontSize: "2.25rem" },
			base: { fontSize: "3rem" },
			lg: { fontSize: "3.75rem" },
			xl: { fontSize: "4.5rem" },
			"2xl": { fontSize: "6rem" },
		},
		weight: Weights,
		lineHeight: LineHeights,
		spacing: Spacings,
	},
});

export const Text = {
	Header: TextHeader,
	Body: TextBody,
};

export default Text;
