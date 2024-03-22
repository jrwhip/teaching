export type ValidateFn = (userInput: string) => boolean;

export class Problem {
  question: string;
  answer: string;
  validate: ValidateFn;
  hint: string;
  constructor(
    question: string,
    answer: string,
    validateFn: ValidateFn,
    hint: string
  ) {
    this.question = question;
    this.answer = answer;
    this.validate = validateFn;
    this.hint = hint;
  }
}
