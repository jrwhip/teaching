import { Injectable } from '@angular/core';

import { map, take, tap } from 'rxjs/operators';

import { MathQuestion } from '../models/math-question.model';

import { StoredMathQuestions } from '../models/stored-math-questions.model';

import { StateService } from './state.service';

import { MathQuestionGenerationService } from './math-question-generation.service';

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


  setNewMathQuestion(operation: string) {
    // This method only fires once.
    let mathQuestion: MathQuestion;
    switch (operation) {
      case 'addition':
        mathQuestion = this.mathQuestionGenerationService.generateAdditionQuestion();
        break;
      case 'subtraction':
        mathQuestion = this.mathQuestionGenerationService.generateSubtractionQuestion();
        break;
      case 'multiplication':
        mathQuestion = this.mathQuestionGenerationService.generateMultiplicationQuestion();
        break;
      case 'division':
        mathQuestion = this.mathQuestionGenerationService.generateDivisionQuestion();
        break;
      default:
        mathQuestion = this.mathQuestionGenerationService.generateAdditionQuestion();
        break;
    }
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
