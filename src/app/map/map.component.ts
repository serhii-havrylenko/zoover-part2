import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';

import { MapService } from './map.service';
import { GeocodingService } from './geocoding.service';
import { Location } from './location.class';

import { WeatherData } from '../weather-data.class';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private markers: any[] = new WeatherData().getData();
  private date: string = "2014-08-10 00:00:00";

  constructor(private mapService: MapService, private geocoder: GeocodingService) { }

  ngOnInit() {
    let map = L.map("map", {
      zoomControl: false,
      center: L.latLng(40.731253, -73.996139),
      zoom: 12,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.mapService.baseMaps.OpenStreetMap]
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    L.control.layers(this.mapService.baseMaps).addTo(map);
    L.control.scale().addTo(map);

    this.mapService.map = map;
    this.geocoder.geocode("Netherlands")
      .subscribe(
      location => map.fitBounds(location.viewBounds),
      err => console.error(err)
      );

    let icon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',

      iconSize: [25, 41],
      shadowSize: [41, 41],
      shadowAnchor: [15, 20]
    })

    let markerGroup = L.markerClusterGroup();

    this.markers.forEach(marker => {
      if (marker.datetime === this.date) {
        let position = L.latLng(marker.latitude, marker.longitude);

        if (Number(marker.temperature_max)) {
          markerGroup.addLayer(L.marker(position, { icon: icon }).bindTooltip(`
              <div class="title"><b>${marker.place_name}</b></div>
              <div class="tooltip-row"><div><img src="/assets/icons/thermometer-lines.svg"/></div><div>${marker.temperature_max}</div></div>
              <div class="tooltip-row"><div><img src="/assets/icons/thermometer.svg"/></div><div>${marker.temperature_min}</div></div>
              <div class="tooltip-row"><div><img src="/assets/icons/water.svg"/></div><div>${marker.precipitation_probability}%</div></div>
              <div class="tooltip-row"><div><img src="/assets/icons/water.svg"/></div><div>${marker.precipitation_mm}</div></div>`,
            { interactive: false, direction: 'right', permanent: true, offset: [15,0] }));
        }
      }
    });

    map.addLayer(markerGroup);
  }

}
