import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeakTimeComponent } from './peak-time.component';

describe('PeakTimeComponent', () => {
  let component: PeakTimeComponent;
  let fixture: ComponentFixture<PeakTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeakTimeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeakTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
