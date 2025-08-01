import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProjectDetailComponent } from './delete-project-detail.component';

describe('DeleteProjectDetailComponent', () => {
  let component: DeleteProjectDetailComponent;
  let fixture: ComponentFixture<DeleteProjectDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProjectDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
