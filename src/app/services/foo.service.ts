import { Injectable } from '@angular/core';

import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CounterData } from '../models/state.model';
import { MathQuestion } from '../models/math-question.model';
import { MathQuestionGenerationService } from './math-question-generation.service';
import { StateService } from './state.service';
import { StoredMathQuestions } from '../models/stored-math-questions.model';

@Injectable({
  providedIn: 'root',
})
export class FooService {
  constructor(private mathQuestionGenerationService: MathQuestionGenerationService, private stateService: StateService) {}

  getStoredMathQuestions() {
    return this.stateService.selectKey('storedMathQuestions');
  }

  setStoredMathQuestions(storedMathQuestions: StoredMathQuestions) {
    this.stateService.patchState({ storedMathQuestions });
  }

  setCounterValues(counterData: CounterData) {
    this.stateService.patchState({ counterValues: counterData });
  }

  setNewMathQuestion(operation: string) {
    const mathQuestion: MathQuestion = this.mathQuestionGenerationService.generateQuestion(operation);
    
    return this.stateService.storedMathQuestions$.pipe(
      // This subsrition is updating the same part of state that it's reading from.
      // This is what was causing the infinite loop. The solution is to use the take(1)
      // operator to complete the subscription after the first emission.
      take(1),
      map((storedMathQuestions) => {
        const newStoredMathQuestions = {
          ...storedMathQuestions,
          [operation]: mathQuestion,
        };
        this.setStoredMathQuestions(newStoredMathQuestions);
      })
    );
  }
}
