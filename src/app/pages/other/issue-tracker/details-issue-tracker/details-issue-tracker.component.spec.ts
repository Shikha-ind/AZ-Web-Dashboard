import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsIssueTrackerComponent } from './details-issue-tracker.component';

describe('DetailsIssueTrackerComponent', () => {
  let component: DetailsIssueTrackerComponent;
  let fixture: ComponentFixture<DetailsIssueTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsIssueTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsIssueTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
