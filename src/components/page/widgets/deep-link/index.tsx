import { Switch } from "@/components/utility";
import { DeepLinkWidgetData, WidgetProps } from "@/lib/types";
import { isNull } from "@/lib/utils";
import React from "react";

type Props = WidgetProps<DeepLinkWidgetData>;

export default function DeepLinkWidget({ widget }: Props) {
	return (
		<div>
			<Switch value={!isNull(widget.image)}>
				<Icon icon={widget.icon} text={widget.linkText} />
				<Image image={widget.image} text={widget.linkText} />
			</Switch>
		</div>
	);
}

function Icon({ icon, text }: { icon: string; text: string }) {
	return (
		<div className="flex flex-col justify-center items-center w-full">
			<img src={icon} alt="link icon" />
			<h2 className="text-3xl uppercase text-white">{text}</h2>
		</div>
	);
}

function Image({ image, text }: { image: string; text: string }) {
	const [error, setError] = React.useState(false);
	const FallbackText = text
		? text
		: image?.match(/^https?:\/\/(?:www\.)?([^.]+)\./i)?.[1] ?? "";

	return (
		<Switch value={error}>
			<div>{FallbackText}</div>
			<img
				src={image}
				alt={FallbackText}
				onError={() => setError(true)}
			/>
		</Switch>
	);
}
