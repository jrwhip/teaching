import { CounterValues } from './counter-values.model';
import { MathQuestion } from './math-question.model';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export class State {
  isLoading: boolean;
  userRole: string | null;
  currentUser: CurrentUser | null;
  mathQuestions: MathQuestion[];
  counterValues: CounterValues;
  constructor() {
    this.isLoading = false;
    this.userRole = null;
    this.currentUser = null;
    this.mathQuestions = [];
    this.counterValues = {
      label: '',
      correct: 0,
      incorrect: 0,
      streak: 0,
      highStreak: 0,
    };
  }
}
