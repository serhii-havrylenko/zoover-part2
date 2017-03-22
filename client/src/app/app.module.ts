import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CovalentCoreModule } from '@covalent/core';
import { Md2Module }  from 'md2';

import { AccommodationsService } from './services/accommodations.service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

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
    AppComponent
  ],
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
    AccommodationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
