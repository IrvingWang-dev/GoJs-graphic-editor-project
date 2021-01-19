import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorStringComponent } from './editor-string.component';

describe('EditorStringComponent', () => {
  let component: EditorStringComponent;
  let fixture: ComponentFixture<EditorStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorStringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
