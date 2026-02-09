import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralDayDetailPage } from './general-day-detail.page';

describe('GeneralDayDetailPage', () => {
  let component: GeneralDayDetailPage;
  let fixture: ComponentFixture<GeneralDayDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralDayDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralDayDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
