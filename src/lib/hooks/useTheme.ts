import { useContext } from "react";
import { ThemeContext } from "../theme";

export function useTheme() {
	const { theme } = useContext(ThemeContext);

	return theme;
}
