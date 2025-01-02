type Props = {
	when: boolean;
	children: React.ReactNode;
};

export function Show({ when, children }: Props) {
	return when ? <>{children}</> : null;
}
