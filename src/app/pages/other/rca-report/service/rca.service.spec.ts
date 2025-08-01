import { TestBed } from '@angular/core/testing';

import { RcaService } from './rca.service';

describe('RcaService', () => {
  let service: RcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
