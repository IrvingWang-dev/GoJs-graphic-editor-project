import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTagComponent } from './editor-tag.component';

describe('EditorTagComponent', () => {
  let component: EditorTagComponent;
  let fixture: ComponentFixture<EditorTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
