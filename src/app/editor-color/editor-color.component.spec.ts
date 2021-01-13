import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorColorComponent } from './editor-color.component';

describe('EditorColorComponent', () => {
  let component: EditorColorComponent;
  let fixture: ComponentFixture<EditorColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorColorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
