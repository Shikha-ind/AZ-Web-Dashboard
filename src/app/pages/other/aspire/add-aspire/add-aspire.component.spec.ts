import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAspireComponent } from './add-aspire.component';

describe('AddAspireComponent', () => {
  let component: AddAspireComponent;
  let fixture: ComponentFixture<AddAspireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAspireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAspireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
