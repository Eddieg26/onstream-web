import { Match, RenderList, Spinner, Switch } from "@/components/utility";
import { Cmp, useCmp } from "@/lib/hooks";
import {
	Forecast,
	Nullable,
	TemperatureFormat,
	WeatherWidgetData,
	WidgetProps,
} from "@/lib/types";
import dayjs from "dayjs";
import { useMemo } from "react";
import useSWR from "swr";
import { Styles } from "./styles";

type Props = WidgetProps<WeatherWidgetData>;

function selector(cmp: Cmp) {
	const { property, getWeather } = cmp;
	return { property, getWeather };
}

export default function WeatherWidget({ context }: Props) {
	const { property, getWeather } = useCmp(selector);

	const zipcode = property?.config?.zipCode;
	const image = property?.config?.endpoints.weatherImage;

	const { data: weatherData, isLoading } = useSWR(
		image ? "weather" : null,
		() => getWeather(context, image, zipcode),
		{ errorRetryCount: 3 }
	);

	const { data: format } = useSWR("temperature", () =>
		context.config.storage.get<TemperatureFormat>("TEMPERATURE-FORMAT")
	);

	const weather = useMemo(() => {
		const tempFormat = format ?? TemperatureFormat.Fahrenheit;

		const avgTemp = getAverageTemperature(
			tempFormat,
			weatherData?.forecastday[0]
		);

		const forecast =
			weatherData?.forecastday.slice(1, 3).map((f) => ({
				timestamp: f.timestamp,
				day: dayjs(f.timestamp * 1000).format("ddd"),
				temp: getAverageTemperature(tempFormat, f),
			})) ?? [];

		return {
			image: weatherData?.forecastday[0]?.imageUrl,
			city: weatherData?.observation?.place?.city ?? "",
			avgTemp,
			forecast,
		};
	}, [weatherData, format]);

	return (
		<Switch>
			<Match when={isLoading}>
				<Spinner />
			</Match>
			<Match when={!isLoading}>
				<Styles.FlexRow>
					<div>
						<Styles.FlexRow>
							<Styles.Logo show={!!weather.image}>
								<img src={weather.image} alt="weather logo" />
							</Styles.Logo>
							<h2>{weather.avgTemp}</h2>
						</Styles.FlexRow>
						<h2>{weather.city}</h2>
					</div>
					<div id="weather-forecast">
						<RenderList
							items={weather.forecast}
							render={(item) => (
								<div>
									<span>{item.day}</span>
									<span>{item.temp}</span>
								</div>
							)}
							keyExtractor={(item) => `${item.timestamp}`}
						/>
					</div>
				</Styles.FlexRow>
			</Match>
		</Switch>
	);
}

function getAverageTemperature(
	format: TemperatureFormat,
	forecast: Nullable<Forecast>
) {
	if (!forecast) return "";

	if (format === TemperatureFormat.Fahrenheit) {
		return `${forecast.avgTempF}`;
	} else {
		return `${forecast.avgTempC}`;
	}
}
