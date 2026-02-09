import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayDetailPage } from './day-detail.page';

describe('DayDetailPage', () => {
  let component: DayDetailPage;
  let fixture: ComponentFixture<DayDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DayDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
