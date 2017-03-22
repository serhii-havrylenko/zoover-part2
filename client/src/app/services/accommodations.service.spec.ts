import { TestBed, inject } from '@angular/core/testing';
import { AccommodationsService } from './accommodations.service';

describe('AccommodationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccommodationsService]
    });
  });

  it('should ...', inject([AccommodationsService], (service: AccommodationsService) => {
    expect(service).toBeTruthy();
  }));
});
