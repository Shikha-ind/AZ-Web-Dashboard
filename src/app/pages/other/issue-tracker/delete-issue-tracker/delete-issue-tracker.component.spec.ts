import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIssueTrackerComponent } from './delete-issue-tracker.component';

describe('DeleteIssueTrackerComponent', () => {
  let component: DeleteIssueTrackerComponent;
  let fixture: ComponentFixture<DeleteIssueTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteIssueTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteIssueTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
