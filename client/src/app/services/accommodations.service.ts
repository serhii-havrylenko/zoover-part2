import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';

const queryAccommodationsAndTraveledWith = gql`
  query AccommodationsAndTraveledWith {
    traveledWith
    accommodations
  }
`;

const queryAccommodationRanking = gql`
  query AccommodationRanking($id: String) {
    accommodation(id: $id) {
      id
      ranking {
        general
        aspects {
          location
          service
          priceQuality
          food
          room
          childFriendly
          interior
          size
          activities
          restaurants
          sanitaryState
          accessibility
          nightlife
          culture
          surrounding
          atmosphere
          noviceSkiArea
          advancedSkiArea
          apresSki
          beach
          entertainment
          environmental
          pool
          terrace
        }
      }
    }
  }
`;

@Injectable()
export class AccommodationsService {

  constructor(private apollo: Apollo) { }

  getDatesAndStations(): Observable<any> {
    return this.apollo.watchQuery({
      query: queryAccommodationsAndTraveledWith
    })
  }

  getAccommodationRanking(id: string): Observable<any> {
    return this.apollo.watchQuery({
      query: queryAccommodationRanking,
      variables: {
        id: id
      }
    })
  }

}
