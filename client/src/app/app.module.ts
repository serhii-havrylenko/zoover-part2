import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CovalentCoreModule } from '@covalent/core';
import { Md2Module }  from 'md2';

import { WeatherService } from './services/weather.service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
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
    WeatherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
