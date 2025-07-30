import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRcaComponent } from './add-rca.component';

describe('AddRcaComponent', () => {
  let component: AddRcaComponent;
  let fixture: ComponentFixture<AddRcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRcaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
