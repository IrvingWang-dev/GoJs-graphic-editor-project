import { TestBed } from '@angular/core/testing';

import { PanelDeviceService } from './panel-device.service';

describe('PanelDeviceService', () => {
  let service: PanelDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
