import { TestBed } from '@angular/core/testing';

import { CursorToolService } from './cursor-tool.service';

describe('CursorToolService', () => {
  let service: CursorToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CursorToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
