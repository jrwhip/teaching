import { TestBed } from '@angular/core/testing';

import { MathQuestionGenerationService } from './math-question-generation.service';

describe('MathQuestionGenerationService', () => {
  let service: MathQuestionGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathQuestionGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
