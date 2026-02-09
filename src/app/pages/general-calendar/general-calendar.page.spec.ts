import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralCalendarPage } from './general-calendar.page';

describe('GeneralCalendarPage', () => {
  let component: GeneralCalendarPage;
  let fixture: ComponentFixture<GeneralCalendarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralCalendarPage],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
