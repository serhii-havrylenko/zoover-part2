import Promise from 'promise';

import data from './data.json';

export function getWeatherDates() {
  let dates = []

  data.forEach((station) => {
    if (dates.indexOf(station.datetime) === -1) {
      dates.push(station.datetime);
    }
  });

  return dates;
}

export function getStations(station_id) {
  let stations = [];

  data.forEach((station) => {
    if (!stations.find((el) => el.station_id === station.station_id) &&
      (!station_id || (station_id && station.station_id === station_id))
    ) {
      stations.push({
        station_id: station.station_id,
        place_name: station.place_name,
        latitude: station.latitude,
        longitude: station.longitude
      });
    }
  });

  return stations;
}

export function getForecast(station_id, datetime) {
  let forecast = [];

  data.forEach((station) => {
    if (station.station_id === station_id &&
      (!datetime || (datetime && new Date(station.datetime).getTime() === new Date(datetime).getTime()))
    ) {
      forecast.push({
        datetime: station.datetime,
        temperature_max: station.temperature_max,
        temperature_min: station.temperature_min,
        precipitation_probability: station.precipitation_probability,
        precipitation_mm: station.precipitation_mm
      });
    }
  });

  return forecast;
}
