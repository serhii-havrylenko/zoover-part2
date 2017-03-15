import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CovalentCoreModule } from '@covalent/core';
import { Md2Module }  from 'md2';

import { MapService } from './services/map.service';
import { GeocodingService } from './services/geocoding.service';
import { WeatherService } from './services/weather.service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { WeatherInCityDialog } from './weather-in-city/weather-in-city-dialog.component';

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:4000/graphql'
  }),
});

export function provideClient(): ApolloClient {
  return client;
}

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
    Md2Module.forRoot(),
    ApolloModule.forRoot(provideClient)
  ],
  providers: [
    MapService,
    GeocodingService,
    WeatherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
