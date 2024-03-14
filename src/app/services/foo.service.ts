import { Injectable } from '@angular/core';

import { map, tap } from 'rxjs/operators';

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
    console.log('setNewMathQuestion');
    console.log('mathQuestion:', mathQuestion);
    return this.stateService.storedMathQuestions$.pipe(
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
