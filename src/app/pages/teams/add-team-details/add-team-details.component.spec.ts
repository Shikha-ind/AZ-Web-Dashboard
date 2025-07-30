import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamDetailsComponent } from './add-team-details.component';

describe('AddTeamDetailsComponent', () => {
  let component: AddTeamDetailsComponent;
  let fixture: ComponentFixture<AddTeamDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTeamDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
