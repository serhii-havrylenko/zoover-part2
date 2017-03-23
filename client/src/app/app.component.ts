import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';

import { AccommodationsService } from './services/accommodations.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [trigger(
    'reviews',
    [
      transition('void => *', [
        style({ transform: 'translateX(-100%) translateY(+100%)' }),
        animate(500)
      ]),
    ])],
})
export class AppComponent implements OnInit {
  private traveledWith: string[] = [];
  private traveledWithFilter: string;
  private accommodationID: string;
  private sortBy: string = 'travelDate';
  private total: number = 0;
  private first: number = 3;
  private offset: number = 0;
  private reviews: any[] = [];
  private generalRating: string;
  private aspectsRating: any;
  private showZeroRating: boolean = false;

  constructor(private accommodationsService: AccommodationsService) { }

  ngOnInit() {
    this.accommodationsService.getDatesAndStations().subscribe(
      ({data}: any) => {
        data.traveledWith.forEach((tr) => this.traveledWith.push(tr.replace(/\b\w/g, l => l.toUpperCase())));
        this.accommodationID = data.accommodations[0];

        this.loadRanking();
        this.loadReviews();
      }
    );
  }

  loadRanking() {
    this.accommodationsService.getAccommodationRanking(this.accommodationID, this.traveledWithFilter).subscribe(
      ({data}: any) => {
        this.generalRating = data.accommodation.ranking.general;
        this.aspectsRating = data.accommodation.ranking.aspects;
      }
    );
  }

  loadReviews() {
    this.accommodationsService.getAccommodationReviews(this.accommodationID, this.first, this.offset, this.sortBy, this.traveledWithFilter).subscribe(
      ({data}: any) => {
        this.total = data.accommodation.reviews.totalCount;
        this.reviews = [...this.reviews, ...data.accommodation.reviews.edges];
      }
    );
  }

  loadMoreReviews() {
    if (this.total > this.offset + this.first) {
      this.offset += this.first;
      this.loadReviews();
    }
  }

  filterReviews() {
    this.reviews = [];
    this.offset = 0;
    this.loadRanking();
    this.loadReviews();
  }

  generalRatingFloor(rating: number): number {
    return Math.floor(rating * 10000) / 10000;
  }
}
