import { TestBed } from '@angular/core/testing';

import { AspireSrviceService } from './aspire-srvice.service';

describe('AspireSrviceService', () => {
  let service: AspireSrviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AspireSrviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
