import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleServiceTypeComponent } from './vehicle-service-type.component';

describe('VehicleServiceTypeComponent', () => {
  let component: VehicleServiceTypeComponent;
  let fixture: ComponentFixture<VehicleServiceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleServiceTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
