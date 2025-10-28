import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';

interface ProblemTypeCategory {
  name: string;
  icon: string;
  types: ProblemType[];
}

interface ProblemType {
  id: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-math-quiz',
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './math-quiz.component.html',
  styleUrls: ['./math-quiz.component.scss']
})
export class MathQuizComponent {
  categories: ProblemTypeCategory[] = [
    {
      name: 'Fractions',
      icon: 'bi-pie-chart',
      types: [
        { id: 'impropertomixed', label: 'Improper to Mixed', route: 'improper-to-mixed' },
        { id: 'mixedtoimproper', label: 'Mixed to Improper', route: 'mixed-to-improper' },
        { id: 'simplify', label: 'Simplify Fractions', route: 'simplify' },
        { id: 'addsubtractmixed', label: 'Add/Subtract Mixed', route: 'add-subtract-mixed' },
        { id: 'wholetimesmixed', label: 'Whole × Mixed', route: 'whole-times-mixed' },
        { id: 'dividefractions', label: 'Divide Fractions', route: 'divide-fractions' },
        { id: 'dividemixednumbers', label: 'Divide Mixed Numbers', route: 'divide-mixed-numbers' },
        { id: 'comparefractions', label: 'Compare Fractions', route: 'compare-fractions' },
        { id: 'fractiontodecimal', label: 'Fraction to Decimal', route: 'fraction-to-decimal' },
        { id: 'decimaltofraction', label: 'Decimal to Fraction', route: 'decimal-to-fraction' }
      ]
    },
    {
      name: 'Basic Operations',
      icon: 'bi-calculator',
      types: [
        { id: 'addition', label: 'Addition', route: 'addition' },
        { id: 'subtraction', label: 'Subtraction', route: 'subtraction' },
        { id: 'multiplication', label: 'Multiplication', route: 'multiplication' },
        { id: 'division', label: 'Division', route: 'division' },
        { id: 'factfamily', label: 'Fact Family', route: 'fact-family' }
      ]
    },
    {
      name: 'Algebra',
      icon: 'bi-funnel',
      types: [
        { id: 'translation', label: 'Translate Expressions', route: 'translation' },
        { id: 'unknown', label: 'Unknown Variables', route: 'unknown' },
        { id: 'factor', label: 'Factor', route: 'factor' },
        { id: 'substitute', label: 'Substitute', route: 'substitute' },
        { id: 'distribute', label: 'Distribute', route: 'distribute' },
        { id: 'solveforx', label: 'Solve for X', route: 'solve-for-x' },
        { id: 'exponent', label: 'Exponents', route: 'exponent' },
        { id: 'exponent2', label: 'Exponents 2', route: 'exponent2' }
      ]
    },
    {
      name: 'Statistics',
      icon: 'bi-bar-chart',
      types: [
        { id: 'mean', label: 'Mean', route: 'mean' },
        { id: 'median', label: 'Median', route: 'median' },
        { id: 'mode', label: 'Mode', route: 'mode' },
        { id: 'range', label: 'Range', route: 'range' },
        { id: 'firstquartile', label: 'First Quartile', route: 'first-quartile' },
        { id: 'thirdquartile', label: 'Third Quartile', route: 'third-quartile' },
        { id: 'interquartilerange', label: 'Interquartile Range', route: 'interquartile-range' }
      ]
    },
    {
      name: 'Number Concepts',
      icon: 'bi-123',
      types: [
        { id: 'rounding', label: 'Rounding', route: 'rounding' },
        { id: 'comparison', label: 'Comparison', route: 'comparison' },
        { id: 'compareintegers', label: 'Compare Integers', route: 'compare-integers' },
        { id: 'absolutevalue', label: 'Absolute Value', route: 'absolute-value' },
        { id: 'opposites', label: 'Opposites', route: 'opposites' }
      ]
    },
    {
      name: 'Ratios & Percentages',
      icon: 'bi-percent',
      types: [
        { id: 'convert', label: 'Convert Percentage', route: 'convert' },
        { id: 'percentofnumber', label: 'Percent of Number', route: 'percent-of-number' },
        { id: 'ratio', label: 'Ratio', route: 'ratio' },
        { id: 'solveratiotable', label: 'Solve Ratio Table', route: 'solve-ratio-table' },
        { id: 'unitrate', label: 'Unit Rate', route: 'unit-rate' }
      ]
    },
    {
      name: 'Other',
      icon: 'bi-puzzle',
      types: [
        { id: 'lcm', label: 'LCM', route: 'lcm' },
        { id: 'gcf', label: 'GCF', route: 'gcf' }
      ]
    }
  ];
}
