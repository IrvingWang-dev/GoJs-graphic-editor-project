import { TestBed } from '@angular/core/testing';

import { RightclickContextService } from './rightclick-context.service';

describe('RightclickContextService', () => {
  let service: RightclickContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RightclickContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
