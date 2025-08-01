import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialougProjectDetailComponent } from './dialoug-project-detail.component';

describe('DialougProjectDetailComponent', () => {
  let component: DialougProjectDetailComponent;
  let fixture: ComponentFixture<DialougProjectDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialougProjectDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialougProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
