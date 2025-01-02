import BaseTheme, { Theme, ThemeConfig, ThemeContext } from "@/lib/theme";
import React from "react";

type Props = {
	children: React.ReactNode | React.ReactNode[];
	theme: Theme;
};

export const ThemeProvider = ({ children, theme }: Props) => {
	const [currentTheme, setTheme] = React.useState<ThemeConfig>(
		BaseTheme.createTheme({
			colors: {
				primary: theme.colors.primary,
			},
		})
	);

	React.useEffect(() => {
		const html = document.querySelector("html");
		if (html) {
			html.classList.remove(currentTheme.className);

			const current = BaseTheme.createTheme(theme);
			html.classList.add(current.className);
			setTheme(current);
		}
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme }}>
			{children}
		</ThemeContext.Provider>
	);
};
