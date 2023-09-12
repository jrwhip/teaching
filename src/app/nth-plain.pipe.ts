import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nthplain'
})
export class NthPlainPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 10:
        return 'tens';
      case 100:
        return 'hundreds';
      case 0.1:
        return 'tenths';
      case 0.01:
        return 'hundredths';
        default:
          return '';
    }
  }
}
