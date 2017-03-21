import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
export class AppComponent implements OnInit {
  private searchState: string = 'invisible';
  private city: number;

  constructor() { }

  ngOnInit() {

  }

  showSearch() {
    this.searchState = 'visible';
  }

  hideSearch() {
    this.city = null;
    this.searchState = 'invisible';
  }
}
