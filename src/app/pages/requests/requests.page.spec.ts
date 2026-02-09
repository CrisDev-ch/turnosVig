import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestsPage } from './requests.page';

describe('RequestsPage', () => {
  let component: RequestsPage;
  let fixture: ComponentFixture<RequestsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
