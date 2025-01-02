import { Match, Switch } from "@/components/utility";
import { MoreInfoWidgetData, WidgetProps } from "@/lib/types";

type Props = WidgetProps<MoreInfoWidgetData>;

export default function MoreInfoWidget(props: Props) {
	const { container } = props;

	return (
		<Switch>
			<Match
				when={container.variant == "hero" && container.type == "main"}
			>
				<Variant.MainHero {...props} />
			</Match>
			<Match
				when={container.variant == "hero" && container.type == "sub"}
			>
				<Variant.SubHero {...props} />
			</Match>
			<Match when={container.variant == "swimlane"}>
				<Variant.Swimlane {...props} />
			</Match>
		</Switch>
	);
}

const Variant = {
	MainHero: ({ widget }: Props) => {
		const { headline, subHeading, bodyText, icon } = widget;

		return (
			<div>
				<h1>{headline}</h1>
				<div>
					<img src={icon} />
					<div>
						<h2>{subHeading}</h2>
						<span>{bodyText}</span>
					</div>
				</div>
				<button>More Information</button>
			</div>
		);
	},
	SubHero: ({ widget }: Props) => {
		const { headline, subHeading, bodyText, icon, heroImage } = widget;

		return (
			<div>
				<div>
					<img src={heroImage} alt="hero image" />
					<div id="gradient" />
				</div>
				<div>
					<div>Live Badge</div>
					<h1>{headline}</h1>
					<div>
						<img src={icon} alt="icon" />
						<div>
							<h2>{subHeading}</h2>
							<span>{bodyText}</span>
						</div>
					</div>
					<button>More Information</button>
				</div>
			</div>
		);
	},
	Swimlane: ({}: Props) => {
		return (
			<div>
				<img src="hero-image" alt="Poster" />
				<div>
					<img alt="Channel Logo" />
					<div>
						<h1>Title</h1>
						<span>Text</span>
					</div>
				</div>
			</div>
		);
	},
};
