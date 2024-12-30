import { SeeAllWidgetData, TileSize } from "@/lib/types";
import { AppContext } from "next/app";

type Props = {
	context: AppContext;
	widget: SeeAllWidgetData;
	container?: {
		tileSize: TileSize;
	};
};

export default function SeeAllWidget({ context, widget, container }: Props) {
	return (
		<a
			href={`/seeall/${widget.swimlaneInfo.type}/${widget.swimlaneInfo.category}`}
		>
			<div>
				<img src="/assets/images/grid.svg" alt="see all logo" />
				<h1>See All</h1>
			</div>
		</a>
	);
}
