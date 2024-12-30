import { RenderList, Switch } from "@/components/utility";
import { Cmp, useCmp } from "@/lib/hooks";
import { WeatherWidgetData, WidgetProps } from "@/lib/types";
import useSWR from "swr";

type Props = WidgetProps<WeatherWidgetData>;

function selector(cmp: Cmp) {
	const { property, getWeather } = cmp;
	return { property, getWeather };
}

export default function WeatherWidget({ context, widget, container }: Props) {
	const { property, getWeather } = useCmp(selector);

	const zipcode = property?.config?.zipCode;
	const image = property?.config?.endpoints.weatherImage;

	const {
		data: weather,
		error,
		isLoading,
	} = useSWR(
		image ? "weather" : null,
		() => getWeather(context, image, zipcode),
		{ errorRetryCount: 3 }
	);

	const forecast = weather?.forecastday.slice(1, 3) ?? [];

	function getAvgTemp() {}

	return (
		<Switch value={isLoading}>
			<div>Loading...</div>
			<div className="flex flex-row">
				<div>
					<div className="flex flex-row">
						<img>Weather Logo</img>
						<h2>Avg Temp</h2>
					</div>
					<div>
						<h2>City</h2>
					</div>
				</div>
				<div id="weather-forecast">
					<RenderList
						items={forecast}
						render={(item) => (
							<div>
								<span>Day</span>
								<span>Avg Temp</span>
							</div>
						)}
						keyExtractor={(item) => `${item.timestamp}`}
					/>
				</div>
			</div>
		</Switch>
	);
}
