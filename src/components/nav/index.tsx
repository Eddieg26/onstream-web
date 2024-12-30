import { PageFilter, usePageFilter, useTheme } from "@/lib/hooks";
import { Page, PageConfig } from "@/lib/types";
import { isNull } from "@/lib/utils";
import { fork, select } from "radash";
import React from "react";
import { useShallow } from "zustand/react/shallow";
import { Icon, IconType } from "../elements/Icon";
import { RenderList, Switch } from "../utility";

type Props = {
	sideNav: boolean;
};

export function Navbar({ sideNav }: Props) {
	const navItems = usePageFilter(useShallow(selectNavPages));

	return (
		<Switch value={sideNav}>
			<SideNavbar items={navItems} />
			<TopNavbar items={navItems} />
		</Switch>
	);
}

function TopNavbar({ items }: { items: PageConfig[] }) {
	const [pinned, grouped] = fork(items, (item) => item.pinned == true);
	return (
		<nav className="flex flex-row items-center px-8 h-28 navbar">
			<div className="flex flex-row items-center flex-grow">
				<div className="mr-8 w-fit max-w-96">
					<img src="/onstream.png" />
				</div>
				<RenderList
					items={grouped}
					render={(item) => (
						<NavItem
							title={item.title}
							icon={getNavIcon(item.page)}
							href={item.page}
							sideNav={false}
						/>
					)}
					keyExtractor={(item) => item.title}
				/>
			</div>
			<div className="flex flex-row items-center">
				<RenderList
					items={pinned}
					render={(item) => (
						<NavItem
							title={item.title}
							icon={getNavIcon(item.page)}
							href={item.page}
							sideNav={false}
						/>
					)}
					keyExtractor={(item) => item.title}
				/>
			</div>
		</nav>
	);
}

function SideNavbar({ items }: { items: PageConfig[] }) {
	const [pinned, grouped] = fork(items, (item) => item.pinned == true);
	const [expanded, setExpanded] = React.useState(false);

	return (
		<nav className={`${expanded ? "w-screen" : ""}`}>
			<div
				className={`navbar flex flex-col items-center h-full ${
					expanded ? "w-40" : "w-20"
				}`}
				onMouseEnter={() => setExpanded(true)}
				onMouseLeave={() => setExpanded(false)}
			>
				<div className="flex flex-col items-center">
					<div className="ml-4 mr-8">
						<img src="/assets/onstream.png" />
					</div>
					<RenderList
						items={grouped}
						render={(item) => (
							<NavItem
								title={item.title}
								icon={getNavIcon(item.title as Page, true)}
								href={item.page}
								sideNav={true}
								compact={!expanded}
							/>
						)}
						keyExtractor={(item) => item.title}
					/>
				</div>
				<div className="flex flex-col items-center">
					<RenderList
						items={pinned}
						render={(item) => (
							<NavItem
								title={item.title}
								icon={getNavIcon(item.page, true)}
								href={item.page}
								sideNav={true}
								compact={!expanded}
							/>
						)}
						keyExtractor={(item) => item.title}
					/>
				</div>
			</div>
		</nav>
	);
}

type NavItemProps = {
	title: string;
	icon: IconType;
	href: string;
	sideNav: boolean;
	compact?: boolean;
};

function NavItem({ title, icon, href, compact, sideNav }: NavItemProps) {
	const theme = useTheme();

	return (
		<a
			href={href}
			style={{ color: theme.primary }}
			className={`btn btn-link justify-center items-center flex no-underline ${
				sideNav ? "flex-row w-full" : "flex-col h-full"
			}`}
		>
			<Icon icon={icon} className="w-8 h-8" style={{ color: "white" }} />
			{!compact && <span>{title}</span>}
		</a>
	);
}

function selectNavPages(state: PageFilter) {
	if (!state.pages) return [];
	const configs = select(
		Object.keys(state.pages) as Page[],
		(page) => {
			return state.pages[page as Page];
		},
		(page) => {
			const config = state.pages[page as Page];
			const hasNav = !isNull(config.navItem);
			const isHidden = state.hidden.pages.includes(page as Page);
			return hasNav && !isHidden;
		}
	);

	return configs;
}

function getNavIcon(page: Page, sideNav = false): IconType {
	switch (page) {
		case "/":
			return sideNav ? "home-alt" : "home";
		case "watch":
			return "watch";
		case "tv-guide":
			return sideNav ? "tvGuide-alt" : "tvGuide";
		case "search":
			return "search";
		case "on-demand":
			return sideNav ? "onDemand-alt" : "onDemand";
		case "settings":
			return sideNav ? "settings-alt" : "settings";
		case "sign-in":
		case "sign-up":
			return "user";
		default:
			return "warning";
	}
}
