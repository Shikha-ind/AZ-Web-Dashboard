import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRcaComponent } from './delete-rca.component';

describe('DeleteRcaComponent', () => {
  let component: DeleteRcaComponent;
  let fixture: ComponentFixture<DeleteRcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRcaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
