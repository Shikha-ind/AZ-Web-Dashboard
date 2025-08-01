import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCaseStudyComponent } from './delete-case-study.component';

describe('DeleteCaseStudyComponent', () => {
  let component: DeleteCaseStudyComponent;
  let fixture: ComponentFixture<DeleteCaseStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCaseStudyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCaseStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
