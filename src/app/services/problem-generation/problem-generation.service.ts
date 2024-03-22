import { Injectable } from '@angular/core';

import { Problem } from '../../models/problem.model';

type ProblemFn = () => Problem;

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
      const module = await import('../foo');
      Object.keys(module).forEach((exportName) => {
        const func = module[exportName as keyof typeof module];
        if (typeof func === 'function') {
          this.registerFunction(exportName, func);
        }
      });
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
    console.error('Function not found:', key);
    return undefined;
  }
}
