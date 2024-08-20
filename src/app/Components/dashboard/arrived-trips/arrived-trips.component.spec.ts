/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ArrivedTripsComponent } from './arrived-trips.component';

describe('ArrivedTripsComponent', () => {
  let component: ArrivedTripsComponent;
  let fixture: ComponentFixture<ArrivedTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrivedTripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrivedTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
