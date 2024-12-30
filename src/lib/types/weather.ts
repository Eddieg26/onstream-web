export interface CommonWeatherDetails {
    timestamp: number;
    dewpointF: number;
    dewpointC: number;
    windSpeedMPH: number;
    windSpeedKPH: number;
    winDir: string;
    weatherShort: string;
    weather: string;
    humidity: number;
    icon: string;
    imageUrl: string;
    feelslikeF: number;
    feelslikeC: number;
    precipIN: number;
    precipMM: number;
    sunrise: number;
    sunset: number;
    isDay: false;
}

export interface WeatherData {
    observation: {
        id: string;
        place: {
            name: string;
            city: string;
        };
        profile: {
            tz: string;
        };
        ob: CommonWeatherDetails & {
            tempF: number;
            tempC: number;
            weatherShort: string;
            humidity: number;
            precipIN: number;
            precipMM: number;
        };
    };
    forecastday: (CommonWeatherDetails & Forecast)[];
}

export interface Forecast {
    maxTempF: number;
    maxTempC: number;
    minTempF: number;
    minTempC: number;
    avgTempF: number;
    avgTempC: number;
    pop: number;
    minFeelslikeC: number;
    minFeelslikeF: number;
    maxFeelslikeC: number;
    maxFeelslikeF: number;
    weatherPrimary: string;
}
