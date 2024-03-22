import { Injectable, inject } from '@angular/core';

import { BarService } from './bar.service';

import { ExtendedProblem } from '../models/extended-problem.model';
import { Problem } from '../models/problem.model';

@Injectable({
    providedIn: 'root',
})
export class BazService {
    barService = inject(BarService);

    generateQuestion(operation: string): ExtendedProblem {
        const operationLookup = ExtendedProblem.operationLookup(operation);
        const { problemGenerateFn, teachingVideoId, exampleVideoId } = operationLookup;
        const problem: Problem = this.barService.executeFunction(problemGenerateFn);
        const extendedProblem = {
            ...problem,
            videoIds: { teaching: teachingVideoId, example: exampleVideoId },
            operation,
        }
        return extendedProblem;
    }
}
