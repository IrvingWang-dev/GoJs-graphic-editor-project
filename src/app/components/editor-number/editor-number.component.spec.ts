import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorNumberComponent } from './editor-number.component';

describe('EditorNumberComponent', () => {
  let component: EditorNumberComponent;
  let fixture: ComponentFixture<EditorNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
