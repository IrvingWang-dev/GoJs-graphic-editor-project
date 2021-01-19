import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenEditorComponent } from './screen-editor.component';

describe('ScreenEditorComponent', () => {
  let component: ScreenEditorComponent;
  let fixture: ComponentFixture<ScreenEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
