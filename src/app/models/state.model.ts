import { CounterValues } from './counter-values.model';
import { MathQuestion } from './math-question.model';
// import { StoredMathQuestions } from './stored-math-questions.model';

export interface StoredMathQuestions {
  [key: string]: MathQuestion;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export class State {
  isLoading: boolean;
  userRole: string | null;
  currentUser: CurrentUser | null;
  storedMathQuestions: StoredMathQuestions | null;
  counterValues: CounterValues;
  constructor() {
    this.isLoading = false;
    this.userRole = null;
    this.currentUser = null;
    this.storedMathQuestions = null;
    this.counterValues = {
      label: '',
      correct: 0,
      incorrect: 0,
      streak: 0,
      highStreak: 0,
    };
  }
}
