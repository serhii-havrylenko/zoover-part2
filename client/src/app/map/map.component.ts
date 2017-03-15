import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TdDialogService } from '@covalent/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

// import '@types/leaflet-markercluster';
import * as L from 'leaflet';
import 'leaflet.markercluster';

import { MapService } from './map.service';
import { GeocodingService } from './geocoding.service';

import { WeatherInCityDialog } from '../weather-in-city/weather-in-city-dialog.component';


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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [trigger(
    'searchState',
    [
      state('invisible', style({
        visibility: 'hidden',
        opacity: 0,
      })),
      state('visible', style({
        visibility: 'visible',
        opacity: 1
      })),
      transition('invisible => visible', animate('.7s ease-in')),
      transition('visible => invisible', animate('.7s ease-out'))
    ])],
})
export class MapComponent implements OnInit {
  private map: any;
  private markerGroup: any;
  private city: number;
  private cities: any[] = [];

  private dates: Date[] = [];
  private date: Date;
  private minDate: Date;
  private maxDate: Date;

  private searchState: string = 'invisible';
  private autoCompleteItems: Array<any> = [];

  constructor(
    private mapService: MapService,
    private geocoder: GeocodingService,
    private dialogService: TdDialogService,
    private apollo: Apollo,
    private dialog: MdDialog
  ) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: queryDateAndStationsNames
    }).subscribe(({data}: any) => {
      data.dates.forEach(d => this.dates.push(new Date(d)));
      this.dates = this.dates.sort();
      [this.date, this.minDate, this.maxDate] = [this.dates[0], this.dates[0], this.dates[this.dates.length - 1]];

      data.stations.forEach(station => this.cities.push({ name: station.place_name, id: station.station_id }));
      this.cities = this.cities.sort((a, b) => a.name.localeCompare(b.name));

      this.displayForecastForDay();
    });

    this.map = L.map("map", {
      zoomControl: false,
      center: L.latLng(40.731253, -73.996139),
      zoom: 12,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.mapService.baseMaps.OpenStreetMap]
    });

    L.control.zoom({ position: "topright" }).addTo(this.map);
    L.control.layers(this.mapService.baseMaps).addTo(this.map);
    L.control.scale().addTo(this.map);

    this.mapService.map = this.map;
    this.geocoder.geocode("Netherlands")
      .subscribe(
      location => this.map.fitBounds(location.viewBounds),
      err => console.error(err)
      );
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

  displayForecastForDay(): void {
    this.loadWeatherForecastForDay(this.date).subscribe(({data}: any) => {
      this.placeMarkers(data.stations);
    });
  }

  showSearch() {
    this.searchState = 'visible';
  }

  hideSearch() {
    this.city = null;
    this.searchState = 'invisible';
  }

  showCityWeather(city): void {
    this.loadWeatherForecastForCity(city || this.city).subscribe(({data}: any) => {
      let dialogRef = this.dialog.open(WeatherInCityDialog, { width: '650px' });
      dialogRef.componentInstance.city = data.stations[0].place_name;
      dialogRef.componentInstance.data = data.stations[0].forecast.slice(0, 5);
      dialogRef.afterClosed().subscribe(result => this.hideSearch());
    });
  }

  placeMarkers(stations: any[]): void {
    if (this.markerGroup) {
      this.map.removeLayer(this.markerGroup);
    }

    let icon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',

      iconSize: [25, 41],
      shadowSize: [41, 41],
      shadowAnchor: [15, 20]
    })

    this.markerGroup = L.markerClusterGroup();

    stations.forEach(station => {
      if (Number(station.forecast[0].temperature_max)) {
        let m = L.marker(
          L.latLng(station.latitude, station.longitude), { icon: icon })
          .bindTooltip(this.buildTooltip(station.place_name, station.forecast[0]), {
            interactive: false,
            direction: 'right',
            permanent: true,
            offset: [15, 0]
          });
        m.on('click', (e: any) => this.showCityWeather(station.station_id));
        this.markerGroup.addLayer(m);
      }
    });

    this.map.addLayer(this.markerGroup);
  }

  buildTooltip(title: string, forecast: any): string {
    return `
      <div class="title"><b>${title}</b></div>
      <div class="tooltip-row"><div><img src="/assets/icons/thermometer-lines.svg"/></div><div>${forecast.temperature_max}</div></div>
      <div class="tooltip-row"><div><img src="/assets/icons/thermometer.svg"/></div><div>${forecast.temperature_min}</div></div>
      <div class="tooltip-row"><div><img src="/assets/icons/water.svg"/></div><div>${forecast.precipitation_probability}%</div></div>
      <div class="tooltip-row"><div><img src="/assets/icons/water.svg"/></div><div>${forecast.precipitation_mm}</div></div>
    `;
  }
}
