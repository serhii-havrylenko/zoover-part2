import { Component, OnInit } from '@angular/core';

import { AccommodationsService } from './services/accommodations.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private traveledWith: string[] = [];
  private traveledWithFilter: string;
  private accommodationID: string;
  private sortBy: string = 'travelDate';
  private generalRating: string;
  private aspectsRating: any;
  private aspectLables: any = {
    location: 'Location',
    service: 'Service',
    priceQuality: 'Price quality',
    food: 'Food',
    room: 'Room',
    childFriendly: 'Child friendly',
    interior: 'Interior',
    size: 'Size',
    activities: 'Activities',
    restaurants: 'Restaurants',
    sanitaryState: 'Sanitary state',
    accessibility: 'Accessibility',
    nightlife: 'Nightlife',
    culture: 'Culture',
    surrounding: 'Surrounding',
    atmosphere: 'Atmosphere',
    noviceSkiArea: 'Novice ski Area',
    advancedSkiArea: 'Advanced ski area',
    apresSki: 'Apres ski',
    beach: 'Beach',
    entertainment: 'Entertainment',
    environmental: 'Environmental',
    pool: 'Pool',
    terrace: 'Terrace'
  };

  constructor(private accommodationsService: AccommodationsService) { }

  ngOnInit() {
    this.accommodationsService.getDatesAndStations().subscribe(
      ({data}: any) => {
        data.traveledWith.forEach((tr) => this.traveledWith.push(tr.replace(/\b\w/g, l => l.toUpperCase())));
        this.accommodationID = data.accommodations[0];

        this.accommodationsService.getAccommodationRanking(this.accommodationID).subscribe(
          ({data}: any) => {
            this.generalRating = data.accommodation.ranking.general;
            this.aspectsRating = data.accommodation.ranking.aspects;
          }
        );
      }
    );
  }

  getRatingByAspect(aspect: string) {
    return Math.floor(this.aspectsRating[aspect] * 100) / 100;
  }
}
