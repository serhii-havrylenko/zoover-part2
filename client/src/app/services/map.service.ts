import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Map, Icon, LatLng, Marker } from 'leaflet';

import { GeocodingService } from './geocoding.service';

import 'leaflet.markercluster';

@Injectable()
export class MapService {
  public baseMaps: any;
  private map: Map;
  private icon: Icon;
  private markerGroup: any;

  constructor(private geocoder: GeocodingService) {
    this.baseMaps = {
      OpenStreetMap: L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
      }),
      Esri: L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
      }),
      CartoDB: L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      })
    };

    this.icon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',

      iconSize: [25, 41],
      shadowSize: [41, 41],
      shadowAnchor: [15, 20]
    });

    this.markerGroup = L.markerClusterGroup();
  }

  createMap(): void {
    this.map = L.map("map", {
      zoomControl: false,
      center: L.latLng(40.731253, -73.996139),
      zoom: 12,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.baseMaps.OpenStreetMap]
    });

    L.control.zoom({ position: "topright" }).addTo(this.map);
    L.control.layers(this.baseMaps).addTo(this.map);
    L.control.scale().addTo(this.map);
  }

  openLocation(place: string): void {
    this.geocoder.geocode(place)
      .subscribe(
      location => this.map.fitBounds(location.viewBounds),
      err => console.error(err)
      );
  }

  addMarker(latLng: LatLng, tooltip: string): Marker {
    let m = L.marker(
      L.latLng(latLng), { icon: this.icon })
      .bindTooltip(tooltip, {
        interactive: false,
        direction: 'right',
        permanent: true,
        offset: [15, 0]
      });

    this.markerGroup.addLayer(m);

    return m;
  }

  clearMarkerGroup(): void {
    this.markerGroup.clearLayers();
  }

  placeMarkerGroup(): void {
    this.map.addLayer(this.markerGroup);
  }
}
