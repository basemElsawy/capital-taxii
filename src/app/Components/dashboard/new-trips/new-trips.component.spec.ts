/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewTripsComponent } from './new-trips.component';

describe('NewTripsComponent', () => {
  let component: NewTripsComponent;
  let fixture: ComponentFixture<NewTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
