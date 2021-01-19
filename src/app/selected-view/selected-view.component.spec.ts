import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedViewComponent } from './selected-view.component';

describe('SelectedViewComponent', () => {
  let component: SelectedViewComponent;
  let fixture: ComponentFixture<SelectedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
