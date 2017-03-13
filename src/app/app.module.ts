import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CovalentCoreModule } from '@covalent/core';
import { Md2Module }  from 'md2';

import { GeocodingService } from './map/geocoding.service';
import { MapService } from './map/map.service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { WeatherInCityDialog } from './weather-in-city/weather-in-city-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    WeatherInCityDialog
  ],
  entryComponents: [WeatherInCityDialog],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    CovalentCoreModule.forRoot(),
    ReactiveFormsModule,
    Md2Module.forRoot()
  ],
  providers: [
    MapService,
    GeocodingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
