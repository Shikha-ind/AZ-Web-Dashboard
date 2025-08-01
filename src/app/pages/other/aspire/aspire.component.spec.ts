import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspireComponent } from './aspire.component';

describe('AspireComponent', () => {
  let component: AspireComponent;
  let fixture: ComponentFixture<AspireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
