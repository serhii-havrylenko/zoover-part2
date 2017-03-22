import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';

@Injectable()
export class AccommodationsService {

  constructor(private apollo: Apollo) { }
}
