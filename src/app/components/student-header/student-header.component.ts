import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { operationLookup } from '../../services/problem-generation/math-operations';

@Component({
  selector: 'app-student-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-header.component.html',
  styles: ``,
})
export class StudentHeaderComponent {
  operationLookup = operationLookup;

  customSort = (a: { key: string }, b: { key: string }): number => {
    // Custom Order of Parent Dropdown Menus. Anything not listed will come after in alphabetical order.
    const order = [
      'Basics',
      'Ratios',
      'Fractions',
      'Equations',
      'RationalNumbers',
      'Data',
    ];
    let indexA = order.indexOf(a.key);
    let indexB = order.indexOf(b.key);

    indexA = indexA === -1 ? order.length + a.key.localeCompare(b.key) : indexA;
    indexB = indexB === -1 ? order.length + b.key.localeCompare(a.key) : indexB;

    return indexA - indexB;
  };
}
