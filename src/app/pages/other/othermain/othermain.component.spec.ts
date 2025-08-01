import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthermainComponent } from './othermain.component';

describe('OthermainComponent', () => {
  let component: OthermainComponent;
  let fixture: ComponentFixture<OthermainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OthermainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OthermainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
