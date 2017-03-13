import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'weather-in-city-dialog',
  templateUrl: './weather-in-city-dialog.html',
  styleUrls: ['./weather-in-city-dialog.scss']
})
export class WeatherInCityDialog {
  city: string;
  data: any;

  constructor(public dialogRef: MdDialogRef<WeatherInCityDialog>) {}
}
