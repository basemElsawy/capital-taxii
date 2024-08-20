/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CancledTripsComponent } from './cancled-trips.component';

describe('CancledTripsComponent', () => {
  let component: CancledTripsComponent;
  let fixture: ComponentFixture<CancledTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancledTripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancledTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
