import { TestBed } from '@angular/core/testing';

import { InteractionProxyService } from './interaction-proxy.service';

describe('InteractionProxyService', () => {
  let service: InteractionProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractionProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
