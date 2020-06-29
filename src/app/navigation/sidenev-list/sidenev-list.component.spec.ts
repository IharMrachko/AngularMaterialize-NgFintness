import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenevListComponent } from './sidenev-list.component';

describe('SidenevListComponent', () => {
  let component: SidenevListComponent;
  let fixture: ComponentFixture<SidenevListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenevListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenevListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
