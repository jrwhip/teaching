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

  // Take 1 or infinite loop

  // TODO: This tries to store in state the validate function, but my state service is not setup to
  // handle storing functions.
  // This needs to be brainstormed more. Because as it is the way Jim wants to do it will not work.
  // Validate is stripped in the calling function.
  setStoredMathQuestions(storedMathQuestions: StoredMathQuestions) {
    console.log('WHAT IS STORED MATH QUESTIONS', storedMathQuestions);
    this.stateService.patchState({ storedMathQuestions });
  }

  setCounterData(counterData: CounterData) {
    console.log('Here is that counter Data: ', counterData);
    this.stateService.patchState({ counterData });
  }

  setNewMathQuestion(operation: string) {
    const capitalizeFirstLetter = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);
    // TODO: This is a hacky way to get the function name. This should be refactored.
    // The function name needs to be listed in math-operations.ts.
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

  setNewCounterValues(operation: string, isCorrect: boolean) {
    return this.stateService.counterData$.pipe(
      take(1),
      map((currentCounterData) => {
        const currentOperationCount = (currentCounterData
          ? currentCounterData[operation]
          : undefined) || {
          correct: 0,
          incorrect: 0,
          streak: 0,
          highStreak: 0,
          label: operation,
        };

        // Update correct or incorrect count based on isCorrect
        const updatedCorrect = isCorrect
          ? currentOperationCount.correct + 1
          : currentOperationCount.correct;
        const updatedIncorrect = !isCorrect
          ? currentOperationCount.incorrect + 1
          : currentOperationCount.incorrect;

        // Update streak and potentially highStreak if answer is correct
        let updatedStreak = currentOperationCount.streak;
        let updatedHighStreak = currentOperationCount.highStreak;

        if (isCorrect) {
          updatedStreak += 1; // Increment streak if correct
          if (updatedStreak > updatedHighStreak) {
            updatedHighStreak = updatedStreak; // Update highStreak if current streak is greater
          }
        } else {
          updatedStreak = 0; // Reset streak if incorrect
        }

        const newCounterData = {
          ...currentCounterData,
          [operation]: {
            correct: updatedCorrect,
            incorrect: updatedIncorrect,
            streak: updatedStreak,
            highStreak: updatedHighStreak,
            label: operation,
          },
        };

        this.updateCounterData(newCounterData);

        this.setCounterData(newCounterData);
      })
    );
  }
}
