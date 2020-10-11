import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextStepWordStudyComponent } from './next-step-word-study.component';

describe('NextStepWordStudyComponent', () => {
  let component: NextStepWordStudyComponent;
  let fixture: ComponentFixture<NextStepWordStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextStepWordStudyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextStepWordStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
