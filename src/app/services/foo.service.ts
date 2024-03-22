import { Injectable, inject } from '@angular/core';

import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CounterData } from '../models/state.model';
import { ProblemGenerationService } from './problem-generation/problem-generation.service';
import { StateService } from './state.service';
import { StoredMathQuestions } from '../models/stored-math-questions.model';

import { Problem } from '../models/problem.model';

@Injectable({
  providedIn: 'root',
})
export class FooService {
  problemGenerationService = inject(ProblemGenerationService);
  stateService = inject(StateService);

  getStoredMathQuestions() {
    return this.stateService.selectKey('storedMathQuestions');
  }

  // TODO: This tries to store in state the validate function, but my state service is not setup to
  // handle storing functions.
  // This needs to be brainstormed more. Because as it is the way Jim wants to do it will not work.
  // Validate is stripped in the calling function.
  setStoredMathQuestions(storedMathQuestions: StoredMathQuestions) {
    console.log('WHAT IS STORED MATH QUESTIONS', storedMathQuestions);
    this.stateService.patchState({ storedMathQuestions });
  }

  updateCounterData(counterData: CounterData) {
    this.stateService.patchState({ counterData });
  }

  setNewMathQuestion(operation: string) {
    const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  
    const foo = `Basics.generate${capitalizeFirstLetter(operation)}Problem`;
    console.log('WHAT IS FOO', foo);
    const mathQuestion: Problem =
      this.problemGenerationService.executeFunction(foo);

    return this.stateService.storedMathQuestions$.pipe(
      // This subsrition is updating the same part of state that it's reading from.
      // This is what was causing the infinite loop. The solution is to use the take(1)
      // operator to complete the subscription after the first emission.
      take(1),
      map((storedMathQuestions) => {
        // TODO: This is stripping the validate function from the mathQuestion object.
        // This is because the state service is not setup to store functions.
        // This needs to be brainstormed more. Because as it is the way Jim wants to do it will not work.
        const { validate, ...newMathQuestion } = mathQuestion;
        const newStoredMathQuestions = {
          ...storedMathQuestions,
          [operation]: newMathQuestion,
        };
        this.setStoredMathQuestions(newStoredMathQuestions);
      })
    );
  }

  // setNewCounterValues(operation: string, isCorrect: boolean) {
  //   return this.stateService.counterData$.pipe(
  //     take(1),
  //     map((currentCounterData) => {
  //       const currentOperationCount = currentCounterData[operation] || { correct: 0, incorrect: 0 };
  //       const newCounterData = {
  //         ...currentCounterData,
  //         [operation]: {
  //           correct: isCorrect ? currentOperationCount.correct + 1 : currentOperationCount.correct,
  //           incorrect: !isCorrect ? currentOperationCount.incorrect + 1 : currentOperationCount.incorrect,
  //         },
  //       };
  //       this.updateCounterData(newCounterData);
  //     })
  //   );
  // }
}
