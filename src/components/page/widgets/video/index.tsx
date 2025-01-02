export default function VideoWidget() {
	return <></>;
}

const Variant = {
	MainHero: () => {
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
	SubHero: () => {
		return <></>;
	},
	Swimlane: () => {
		return (
			<div>
				<img src="hero-image" alt="Poster" />
				<div>
					<video />
					<div>
						<img alt="Channel Logo" />
						<div>
							<h1>Title</h1>
							<span>Text</span>
						</div>
					</div>
				</div>
			</div>
		);
	},
};
