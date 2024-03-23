import { Injectable } from '@angular/core';

import * as ProblemCategories from './index';
import { Problem } from '../../models/problem.model';

type ProblemFn = () => Problem;

interface CategoryFunctions {
  [funcName: string]: ProblemFn; // This is an index signature
}

@Injectable({
  providedIn: 'root',
})
export class ProblemGenerationService {
  private functionMap: { [key: string]: ProblemFn } = {};
  private isInitialized = false;

  async initializeFunctionRegistry() {
    if (this.isInitialized) {
      return;
    }
    try {
      Object.entries(ProblemCategories).forEach(
        ([categoryName, categoryFunctions]: [string, CategoryFunctions]) => {
          Object.keys(categoryFunctions).forEach((funcName) => {
            this.registerFunction(
              `${categoryName}.${funcName}`,
              categoryFunctions[funcName]
            );
          });
        }
      );
    } catch (error) {
      console.error('Error importing module:', error);
    }
    this.isInitialized = true;
  }

  private registerFunction(key: string, func: ProblemFn) {
    this.functionMap[key] = func;
  }

  getFunction(key: string): ProblemFn | undefined {
    return this.functionMap[key];
  }

  executeFunction(key: string, ...args: any[]): any {
    const func = this.getFunction(key);
    if (func) {
      return func();
    }
    console.warn('Function not found:', key);
    return undefined;
  }
}
