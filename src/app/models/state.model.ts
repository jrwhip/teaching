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

export interface CounterData {
  [key: string]: CounterValues;
}

export class State {
  isLoading: boolean;
  userRole: string | null;
  currentUser: CurrentUser | null;
  storedMathQuestions: StoredMathQuestions | null;
  counterData: CounterData | null;
  constructor() {
    this.isLoading = false;
    this.userRole = null;
    this.currentUser = null;
    this.storedMathQuestions = null;
    this.counterData = null;
  }
}
