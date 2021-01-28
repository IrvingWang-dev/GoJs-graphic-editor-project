import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightclickContextComponent } from './rightclick-context.component';

describe('RightclickContextComponent', () => {
  let component: RightclickContextComponent;
  let fixture: ComponentFixture<RightclickContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightclickContextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightclickContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
