import { WidgetData, WidgetType } from "@/lib/types";

type WidgetProps = {
	widget: WidgetData;
};

const WidgetRenderer: React.FC<WidgetProps> = () => {
	return <div>Widget</div>;
};

const WidgetRenderers: Record<WidgetType, React.ComponentType<WidgetProps>> = {
	live: WidgetRenderer,
	"more-info": WidgetRenderer,
	weather: WidgetRenderer,
	sports: WidgetRenderer,
	notification: WidgetRenderer,
	video: WidgetRenderer,
	ad: WidgetRenderer,
	"deep-link": WidgetRenderer,
	"full-page": WidgetRenderer,
	error: WidgetRenderer,
	game: WidgetRenderer,
	"see-all": WidgetRenderer,
	"on-demand": WidgetRenderer,
	dvr: WidgetRenderer,
};

type Props = {
	widget: WidgetData;
};

export default function Widget({ widget }: Props) {
	const Renderer = WidgetRenderers[widget.meta.type];
	return <Renderer widget={widget} />;
}
