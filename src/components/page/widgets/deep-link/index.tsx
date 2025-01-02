import { Text } from "@/components/elements";
import { Match, Switch } from "@/components/utility";
import { DeepLinkWidgetData, WidgetProps } from "@/lib/types";
import { isNull } from "@/lib/utils";
import React from "react";
import { IconContainer } from "./styles";

type Props = WidgetProps<DeepLinkWidgetData>;

export default function DeepLinkWidget({ widget }: Props) {
	return (
		<div>
			<Switch>
				<Match when={isNull(widget.image)}>
					<Icon icon={widget.icon} text={widget.linkText} />
				</Match>
				<Match when={!isNull(widget.image)}>
					<Image image={widget.image} text={widget.linkText} />
				</Match>
			</Switch>
		</div>
	);
}

function Icon({ icon, text }: { icon: string; text: string }) {
	return (
		<IconContainer>
			<img src={icon} alt="link icon" />
			<Text.Header size="lg">{text}</Text.Header>
		</IconContainer>
	);
}

function Image({ image, text }: { image: string; text: string }) {
	const [error, setError] = React.useState(false);
	const FallbackText = text
		? text
		: image?.match(/^https?:\/\/(?:www\.)?([^.]+)\./i)?.[1] ?? "";

	return (
		<Switch>
			<Match when={error}>
				<div>{FallbackText}</div>
			</Match>
			<Match when={!error}>
				<img
					src={image}
					alt={FallbackText}
					onError={() => setError(true)}
				/>
			</Match>
		</Switch>
	);
}
