"use client";
import { Onstream } from "@/components/providers";
import { createConfig } from "@/lib/utils";
import "./globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Onstream config={createConfig({})}>{children}</Onstream>
			</body>
		</html>
	);
}
