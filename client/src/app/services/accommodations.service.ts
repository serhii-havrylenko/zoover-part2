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

const queryAccommodationReviews = gql`
  query AccommodationRanking($id: String, $first: Int, $offset: Int, $sortBy: String, $traveledWith: String) {
    accommodation(id: $id) {
      id
      reviews(first: $first, offset: $offset, sortBy: $sortBy, traveledWith: $traveledWith) {
        totalCount
        edges {
          id
          traveledWith
          entryDate
          travelDate
          title
          text
          user
          locale
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

  getAccommodationReviews(id: string, first: number, offset: number, sortBy: string, traveledWith: string): Observable<any> {
    return this.apollo.watchQuery({
      query: queryAccommodationReviews,
      variables: {
        id,
        first,
        offset,
        sortBy,
        traveledWith
      }
    })
  }

}
