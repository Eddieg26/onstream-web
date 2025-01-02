import { PageFilter, usePageFilter, useTheme } from "@/lib/hooks";
import { Page, PageConfig } from "@/lib/types";
import { isNull } from "@/lib/utils";
import { fork, select } from "radash";
import React from "react";
import { useShallow } from "zustand/react/shallow";
import { IconType } from "../elements/Icon";
import { Match, RenderList, Switch } from "../utility";
import { Styles } from "./styles";

type Props = {
	sideNav: boolean;
};

export function Navbar({ sideNav }: Props) {
	const navItems = usePageFilter(useShallow(selectNavPages));

	return (
		<Switch>
			<Match when={sideNav}>
				<SideNavbar items={navItems} />
			</Match>
			<Match when={!sideNav}>
				<TopNavbar items={navItems} />
			</Match>
		</Switch>
	);
}

function TopNavbar({ items }: { items: PageConfig[] }) {
	const [start, end] = fork(items, (item) => !item.pinned);
	return (
		<Styles.TopNav>
			<Styles.NavItems variant="start">
				<img src="/onstream.png" />
				<RenderList
					items={start}
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
			</Styles.NavItems>
			<Styles.NavItems variant="end">
				<RenderList
					items={end}
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
			</Styles.NavItems>
		</Styles.TopNav>
	);
}

function SideNavbar({ items }: { items: PageConfig[] }) {
	const [start, end] = fork(items, (item) => !item.pinned);
	const [expanded, setExpanded] = React.useState(false);

	return (
		<Styles.SideNav>
			<div
				id="container"
				onMouseEnter={() => setExpanded(true)}
				onMouseLeave={() => setExpanded(false)}
			>
				<Styles.NavItems variant="start">
					<img src="/assets/onstream.png" />
					<RenderList
						items={start}
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
				</Styles.NavItems>
				<Styles.NavItems variant="end">
					<RenderList
						items={end}
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
				</Styles.NavItems>
			</div>
		</Styles.SideNav>
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
		<Styles.NavLink
			href={href}
			style={{ color: theme.colors.primary }}
			sideNav={sideNav}
		>
			<Styles.NavIcon
				icon={icon}
				className="w-8 h-8"
				style={{ color: theme.colors.primary }}
			/>
			{!compact && <span>{title}</span>}
		</Styles.NavLink>
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
