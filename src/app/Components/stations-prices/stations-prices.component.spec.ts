import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationsPricesComponent } from './stations-prices.component';

describe('StationsPricesComponent', () => {
  let component: StationsPricesComponent;
  let fixture: ComponentFixture<StationsPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationsPricesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StationsPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
