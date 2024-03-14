import { MathQuestion } from './math-question.model';

export interface StoredMathQuestions {
  [key: string]: MathQuestion;
}
