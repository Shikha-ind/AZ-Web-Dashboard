import { TestBed } from '@angular/core/testing';

import { TestimonialsServiceService } from './testimonials-service.service';

describe('TestimonialsServiceService', () => {
  let service: TestimonialsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestimonialsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
