import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRiskComponent } from './delete-risk.component';

describe('DeleteRiskComponent', () => {
  let component: DeleteRiskComponent;
  let fixture: ComponentFixture<DeleteRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRiskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
