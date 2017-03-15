import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';

const queryDateAndStationsNames = gql`
  query DateAndStationsNames {
    dates
    stations {
      station_id
      place_name
    }
  }
`;
const queryWeatherForecastForStation = gql`
  query WeatherForecastForStation($id: Int) {
    stations(station_id: $id) {
      place_name
      forecast {
        datetime
        temperature_max
        temperature_min
        precipitation_probability
        precipitation_mm
      }
    }
  }
`;

const queryWeatherForecastForDay = gql`
  query queryWeatherForecastForDay($datetime: String) {
    stations {
      station_id
      place_name
      latitude
      longitude
      forecast(datetime: $datetime) {
        temperature_max
        temperature_min
        precipitation_probability
        precipitation_mm
      }
    }
  }
`;

@Injectable()
export class WeatherService {

  constructor(private apollo: Apollo) { }

  getDatesAndStations() {
    return this.apollo.watchQuery({
      query: queryDateAndStationsNames
    })
  }

  loadWeatherForecastForDay(datetime: Date): Observable<any> {
    return this.apollo.watchQuery({
      query: queryWeatherForecastForDay,
      variables: {
        datetime: datetime.toISOString()
      }
    });
  }

  loadWeatherForecastForCity(id: number): Observable<any> {
    return this.apollo.watchQuery({
      query: queryWeatherForecastForStation,
      variables: {
        id: id
      }
    });
  }
}
