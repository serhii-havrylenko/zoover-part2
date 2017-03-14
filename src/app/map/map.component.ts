import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TdDialogService } from '@covalent/core';
import { MdDialog, MdDialogRef } from '@angular/material';

// import '@types/leaflet-markercluster';
import * as L from 'leaflet';
import 'leaflet.markercluster';

import { MapService } from './map.service';
import { GeocodingService } from './geocoding.service';

import { WeatherData } from '../weather-data.class';
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
  private map: any;
  private markerGroup: any;
  private markers: any[] = new WeatherData().getData();
  private date: Date = new Date('2014-08-08 00:00:00');
  private city: string;
  private cities: string[] = [];

  private minDate: Date = new Date('2014-08-08 00:00:00');
  private maxDate: Date = new Date('2014-08-13 00:00:00');

  private searchState: string = 'invisible';
  private cityCtrl: FormControl = new FormControl();
  private filteredCities: any;

  item: string = null;
  items: Array<any> = [];

  constructor(
    private mapService: MapService,
    private geocoder: GeocodingService,
    private dialogService: TdDialogService,
    public dialog: MdDialog
  ) { }

  ngOnInit() {
    this.markers.forEach(marker => {
      if (this.cities.indexOf(marker.place_name) === -1) {
        this.cities.push(marker.place_name);
      }
    });

    this.cities = this.cities.sort();

    this.cities.forEach(city => this.items.push({ name: city }));

    this.filteredCities = this.cityCtrl.valueChanges
      .startWith(null)
      .map(city => this.filterCities(city))

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

    this.placeMarkers();
  }

  filterCities(val: string) {
    return val ? this.cities.filter((s) => new RegExp(val, 'gi').test(s)) : this.cities;
  }

  searchClick() {
    this.city = '';
    this.searchState = this.searchState === 'visible' ? 'invisible' : 'visible';
  }

  showCityWeather(city): void {
    if (city) {
      let dialogRef = this.dialog.open(WeatherInCityDialog, { width: '650px' });
      dialogRef.componentInstance.city = city;
      dialogRef.componentInstance.data = this.markers.filter(el => el.place_name == city).slice(0, 5);
      dialogRef.afterClosed().subscribe(result => this.searchClick());
    }
  }

  placeMarkers(): void {
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

    this.markers.forEach(marker => {
      if ((new Date(marker.datetime)).getTime() === this.date.getTime()) {
        let position = L.latLng(marker.latitude, marker.longitude);

        if (Number(marker.temperature_max)) {
          let m = L.marker(position, { icon: icon })
            .bindTooltip(this.buildTooltip(marker), {
              interactive: false,
              direction: 'right',
              permanent: true,
              offset: [15, 0]
            });
          m.on('click', (e: any) => this.showCityWeather(marker.place_name));
          this.markerGroup.addLayer(m);
        }
      }
    });

    this.map.addLayer(this.markerGroup);
  }

  buildTooltip(marker: any): string {
    return `
      <div class="title"><b>${marker.place_name}</b></div>
      <div class="tooltip-row"><div><img src="/assets/icons/thermometer-lines.svg"/></div><div>${marker.temperature_max}</div></div>
      <div class="tooltip-row"><div><img src="/assets/icons/thermometer.svg"/></div><div>${marker.temperature_min}</div></div>
      <div class="tooltip-row"><div><img src="/assets/icons/water.svg"/></div><div>${marker.precipitation_probability}%</div></div>
      <div class="tooltip-row"><div><img src="/assets/icons/water.svg"/></div><div>${marker.precipitation_mm}</div></div>
    `;
  }
}
