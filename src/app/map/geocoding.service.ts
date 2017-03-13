import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { Location } from "./location.class";

@Injectable()
export class GeocodingService {
  constructor(private http: Http) {}

  geocode(address: string) {
    return this.http
      .get("http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address))
      .map(res => res.json())
      .map(result => {
        if (result.status !== "OK") { throw new Error("unable to geocode address"); }

        let location = new Location();
        location.address = result.results[0].formatted_address;
        location.latitude = result.results[0].geometry.location.lat;
        location.longitude = result.results[0].geometry.location.lng;

        let viewPort = result.results[0].geometry.viewport;
        location.viewBounds = L.latLngBounds(
          {
            lat: viewPort.southwest.lat,
            lng: viewPort.southwest.lng
          },
          {
            lat: viewPort.northeast.lat,
            lng: viewPort.northeast.lng
          });

        return location;
      });
  }
}
