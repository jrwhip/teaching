import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';

import { MathQuestion } from '../models/math-question.model';

import { StoredMathQuestions } from '../models/stored-math-questions.model';

import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class FooService {
  constructor(private stateService: StateService) {}

  getStoredMathQuestions() {
    return this.stateService.selectKey('storedMathQuestions');
  }

  setStoredMathQuestions(storedMathQuestions: StoredMathQuestions) {
    this.stateService.patchState({ storedMathQuestions });
  }


  setNewMathQuestion(operation: string, mathQuestion: MathQuestion) {
    console.log('setNewMathQuestion');
    return this.getStoredMathQuestions().pipe(
      tap((res) => {
        const storedMathQuestions = res as StoredMathQuestions;
        const newStoredMathQuestions = {
          ...storedMathQuestions,
          [operation]: mathQuestion,
        };
        this.setStoredMathQuestions(newStoredMathQuestions);
      })
    );
  }
}
