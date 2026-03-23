export interface Problem {
  question: string;
  answer: string;
  validate: (userInput: string) => boolean;
  hint: string;
  needsExtraInput: boolean;
  needsCompareButtons?: boolean;
}

export interface ProblemGenerator {
  generate: () => Problem;
}

export type ProblemType =
  | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'rounding' | 'factfamily'
  | 'simplify' | 'addsubtractmixed' | 'mixedtoimproper' | 'impropertomixed'
  | 'wholetimesmixed' | 'dividefractions' | 'dividemixednumbers'
  | 'fractiontodecimal' | 'decimaltofraction'
  | 'comparefractions' | 'comparison' | 'compareintegers'
  | 'convert' | 'percentofnumber'
  | 'ratio' | 'solveratiotable' | 'unitrate'
  | 'translation' | 'unknown' | 'factor' | 'substitute' | 'substituteadvanced'
  | 'distribute' | 'solveforx' | 'exponent' | 'exponent2'
  | 'absolutevalue' | 'opposites' | 'lcm' | 'gcf'
  | 'mean' | 'median' | 'mode' | 'range'
  | 'firstquartile' | 'thirdquartile' | 'interquartilerange'
  | 'trapezoid' | 'triangle' | 'writeequation';

export interface MenuCategory {
  label: string;
  items: Array<{ label: string; type: ProblemType }>;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    label: 'Basics',
    items: [
      { label: 'Add', type: 'addition' },
      { label: 'Subtract', type: 'subtraction' },
      { label: 'Multiply', type: 'multiplication' },
      { label: 'Divide', type: 'division' },
      { label: 'Round', type: 'rounding' },
    ],
  },
  {
    label: 'Fractions',
    items: [
      { label: 'Simplify', type: 'simplify' },
      { label: 'Add, Subtract', type: 'addsubtractmixed' },
      { label: 'Mixed To Improper', type: 'mixedtoimproper' },
      { label: 'Improper To Mixed', type: 'impropertomixed' },
      { label: 'Whole Times Mixed', type: 'wholetimesmixed' },
      { label: 'Divide', type: 'dividefractions' },
      { label: 'Divide Mixed', type: 'dividemixednumbers' },
    ],
  },
  {
    label: 'Compare',
    items: [
      { label: 'Fractions', type: 'comparefractions' },
      { label: 'Decimals', type: 'comparison' },
      { label: 'Integers', type: 'compareintegers' },
    ],
  },
  {
    label: 'Percent',
    items: [
      { label: 'Convert', type: 'convert' },
      { label: 'Percent of Number', type: 'percentofnumber' },
    ],
  },
  {
    label: 'Ratios',
    items: [
      { label: 'Ratio', type: 'ratio' },
      { label: 'Table', type: 'solveratiotable' },
      { label: 'Unit Rate', type: 'unitrate' },
    ],
  },
  {
    label: 'Equation',
    items: [
      { label: 'Translation', type: 'translation' },
      { label: 'Unknown', type: 'unknown' },
      { label: 'Factor', type: 'factor' },
      { label: 'Substitute', type: 'substitute' },
      { label: 'Substitute 2', type: 'substituteadvanced' },
      { label: 'Distribute', type: 'distribute' },
      { label: 'Solve For X', type: 'solveforx' },
      { label: 'Exponent', type: 'exponent' },
      { label: 'Exponent2', type: 'exponent2' },
    ],
  },
  {
    label: 'Numbers',
    items: [
      { label: 'Absolute Value', type: 'absolutevalue' },
      { label: 'Opposites', type: 'opposites' },
      { label: 'LCM', type: 'lcm' },
      { label: 'GCF', type: 'gcf' },
    ],
  },
  {
    label: 'Statistics',
    items: [
      { label: 'Mean', type: 'mean' },
      { label: 'Median', type: 'median' },
      { label: 'Mode', type: 'mode' },
      { label: 'Range', type: 'range' },
      { label: 'First Quartile', type: 'firstquartile' },
      { label: 'Third Quartile', type: 'thirdquartile' },
      { label: 'InterQuartile Range', type: 'interquartilerange' },
    ],
  },
  {
    label: 'Fact Family',
    items: [
      { label: 'Fact Family (\u00D7 and \u00F7)', type: 'factfamily' },
    ],
  },
];
