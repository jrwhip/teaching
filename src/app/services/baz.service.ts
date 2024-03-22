import { Injectable, inject } from '@angular/core';

import { ProblemGenerationService } from './problem-generation/problem-generation.service';

import { ExtendedProblem } from '../models/extended-problem.model';
import { Problem } from '../models/problem.model';

@Injectable({
  providedIn: 'root',
})
export class BazService {
  problemGenerationService = inject(ProblemGenerationService);

  generateQuestion(operation: string): ExtendedProblem {
    const operationLookup = ExtendedProblem.operationLookup(operation);
    const { problemGenerateFn, teachingVideoId, exampleVideoId } =
      operationLookup;
    const problem: Problem =
      this.problemGenerationService.executeFunction(problemGenerateFn);
    const extendedProblem = {
      ...problem,
      videoIds: { teaching: teachingVideoId, example: exampleVideoId },
      operation,
    };
    return extendedProblem;
  }
}
