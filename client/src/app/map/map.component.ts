import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

// import '@types/leaflet-markercluster';
import * as L from 'leaflet';
import 'leaflet.markercluster';

import { MapService } from '../services/map.service';

import { WeatherService } from '../services/weather.service';

import { WeatherInCityDialog } from '../weather-in-city/weather-in-city-dialog.component';

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
    private weatherService: WeatherService,
    private dialog: MdDialog
  ) { }

  ngOnInit() {
    this.weatherService.getDatesAndStations().subscribe(({data}: any) => {
      data.dates.forEach(d => this.dates.push(new Date(d)));
      this.dates = this.dates.sort();
      [this.date, this.minDate, this.maxDate] = [this.dates[0], this.dates[0], this.dates[this.dates.length - 1]];

      data.stations.forEach(station => this.cities.push({ name: station.place_name, id: station.station_id }));
      this.cities = this.cities.sort((a, b) => a.name.localeCompare(b.name));

      this.displayForecastForDay();
    });

    this.mapService.createMap();
    this.mapService.openLocation('Netherlands');
  }

  displayForecastForDay(): void {
    this.weatherService.loadWeatherForecastForDay(this.date).subscribe(({data}: any) => {
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

  showCityWeather(city: number): void {
    this.weatherService.loadWeatherForecastForCity(city || this.city).subscribe(({data}: any) => {
      let dialogRef = this.dialog.open(WeatherInCityDialog, { width: '650px' });
      dialogRef.componentInstance.city = data.stations[0].place_name;
      dialogRef.componentInstance.data = data.stations[0].forecast.slice(0, 5);
      dialogRef.afterClosed().subscribe(result => this.hideSearch());
    });
  }

  placeMarkers(stations: any[]): void {
    this.mapService.clearMarkerGroup();

    stations.forEach(station => {
      if (Number(station.forecast[0].temperature_max)) {
        this.mapService.addMarker(
          L.latLng(station.latitude, station.longitude),
          this.buildTooltip(station.place_name, station.forecast[0])
        ).on('click', () => this.showCityWeather(station.station_id));
      }
    });

    this.mapService.placeMarkerGroup();
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
