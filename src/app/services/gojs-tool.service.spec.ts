import { TestBed } from '@angular/core/testing';

import { GojsToolService } from './gojs-tool.service';

describe('GojsToolService', () => {
  let service: GojsToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GojsToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
