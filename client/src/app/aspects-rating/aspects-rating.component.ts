import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'aspects-rating',
  templateUrl: './aspects-rating.component.html',
  styleUrls: ['./aspects-rating.component.scss']
})
export class AspectsRatingComponent implements OnInit {
  @Input('ranking')
  rating: any;
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

  constructor() { }

  ngOnInit() {
  }

  getRatingByAspect(aspect: string): number {
    return Math.floor(this.rating[aspect] * 100) / 100;
  }
}
