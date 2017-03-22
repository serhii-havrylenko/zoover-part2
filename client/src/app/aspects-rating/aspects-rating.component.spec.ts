import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AspectsRatingComponent } from './aspects-rating.component';

describe('AspectsRatingComponent', () => {
  let component: AspectsRatingComponent;
  let fixture: ComponentFixture<AspectsRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AspectsRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AspectsRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
