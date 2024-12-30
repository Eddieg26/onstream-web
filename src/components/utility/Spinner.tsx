type Props = {
	size?: "xs" | "sm" | "md" | "lg";
	color?: string;
};

export function Spinner({ size = "xs", color }: Props) {
	return <span style={{ color }} />;
}
