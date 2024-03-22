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

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    // Dynamically import functions from 'foo.ts'
    // this.initializeFunctionRegistry();
  }

  async initializeFunctionRegistry() {
    if (this.isInitialized) {
      return;
    }
    try {
      // const module = await import('../foo');
      Object.entries(ProblemCategories).forEach(([categoryName, categoryFunctions]: [string, CategoryFunctions]) => {
        console.log('categoryName:', categoryName);
        console.log('categoryFunctions:', categoryFunctions);
        Object.keys(categoryFunctions).forEach(funcName => {
          this.registerFunction(`${categoryName}.${funcName}`, categoryFunctions[funcName]);
        });
      });
    } catch (error) {
      console.error('Error importing module:', error);
    }
    this.isInitialized = true;
  }

  // private initializeFunctionRegistry() {
  //   Object.entries(ProblemCategories).forEach(([categoryName, categoryFunctions]) => {
  //     Object.keys(categoryFunctions).forEach(funcName => {
  //       this.registerFunction(`${categoryName}.${funcName}`, categoryFunctions[funcName]);
  //     });
  //   });
  // }

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
    console.error('Function not found:', key);
    return undefined;
  }
}
