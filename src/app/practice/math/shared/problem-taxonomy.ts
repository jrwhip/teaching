/**
 * Maps every problem type key to display metadata and DB-level category.
 * Used by MathResultsService when recording ProblemAttempts.
 */
export interface ProblemTaxonomyEntry {
  /** Human-readable label (e.g. "Add Fractions") */
  displayLabel: string;
  /** Broad DB category (maps to problemCategory in ProblemAttempt) */
  category: string;
  /** Exact key stored in problemType field */
  problemType: string;
}

/**
 * Comprehensive taxonomy covering:
 * - Quiz component: 40+ ProblemType values from problem.model.ts
 * - Quiz2 component: 20 generator-based problem slots
 * - Quiz3 component: 10 "Solve for N" generator slots
 * - Canvas components: number-line, inequality, coordinate-grid, area-perimeter
 */
export const PROBLEM_TAXONOMY: Record<string, ProblemTaxonomyEntry> = {
  // ── Quiz: Basics ──────────────────────────────────────────────────────
  addition:        { displayLabel: 'Addition',          category: 'Basics',     problemType: 'addition' },
  subtraction:     { displayLabel: 'Subtraction',       category: 'Basics',     problemType: 'subtraction' },
  multiplication:  { displayLabel: 'Multiplication',    category: 'Basics',     problemType: 'multiplication' },
  division:        { displayLabel: 'Division',          category: 'Basics',     problemType: 'division' },
  rounding:        { displayLabel: 'Rounding',          category: 'Basics',     problemType: 'rounding' },
  factfamily:      { displayLabel: 'Fact Family',       category: 'Basics',     problemType: 'factfamily' },

  // ── Quiz: Fractions ───────────────────────────────────────────────────
  simplify:            { displayLabel: 'Simplify Fractions',        category: 'Fractions', problemType: 'simplify' },
  addsubtractmixed:    { displayLabel: 'Add/Subtract Mixed',        category: 'Fractions', problemType: 'addsubtractmixed' },
  mixedtoimproper:     { displayLabel: 'Mixed to Improper',         category: 'Fractions', problemType: 'mixedtoimproper' },
  impropertomixed:     { displayLabel: 'Improper to Mixed',         category: 'Fractions', problemType: 'impropertomixed' },
  wholetimesmixed:     { displayLabel: 'Whole Times Mixed',         category: 'Fractions', problemType: 'wholetimesmixed' },
  dividefractions:     { displayLabel: 'Divide Fractions',          category: 'Fractions', problemType: 'dividefractions' },
  dividemixednumbers:  { displayLabel: 'Divide Mixed Numbers',      category: 'Fractions', problemType: 'dividemixednumbers' },
  fractiontodecimal:   { displayLabel: 'Fraction to Decimal',       category: 'Fractions', problemType: 'fractiontodecimal' },
  decimaltofraction:   { displayLabel: 'Decimal to Fraction',       category: 'Fractions', problemType: 'decimaltofraction' },

  // ── Quiz: Compare ─────────────────────────────────────────────────────
  comparefractions:  { displayLabel: 'Compare Fractions',   category: 'Compare', problemType: 'comparefractions' },
  comparison:        { displayLabel: 'Compare Decimals',    category: 'Compare', problemType: 'comparison' },
  compareintegers:   { displayLabel: 'Compare Integers',    category: 'Compare', problemType: 'compareintegers' },

  // ── Quiz: Percent ─────────────────────────────────────────────────────
  convert:          { displayLabel: 'Percent Convert',      category: 'Percent', problemType: 'convert' },
  percentofnumber:  { displayLabel: 'Percent of Number',    category: 'Percent', problemType: 'percentofnumber' },

  // ── Quiz: Ratios ──────────────────────────────────────────────────────
  ratio:            { displayLabel: 'Ratio',                category: 'Ratios',   problemType: 'ratio' },
  solveratiotable:  { displayLabel: 'Ratio Table',          category: 'Ratios',   problemType: 'solveratiotable' },
  unitrate:         { displayLabel: 'Unit Rate',            category: 'Ratios',   problemType: 'unitrate' },

  // ── Quiz: Equation ────────────────────────────────────────────────────
  translation:        { displayLabel: 'Translation',          category: 'Equation',  problemType: 'translation' },
  unknown:            { displayLabel: 'Unknown',              category: 'Equation',  problemType: 'unknown' },
  factor:             { displayLabel: 'Factor',               category: 'Equation',  problemType: 'factor' },
  substitute:         { displayLabel: 'Substitute',           category: 'Equation',  problemType: 'substitute' },
  substituteadvanced: { displayLabel: 'Substitute (Advanced)',category: 'Equation',  problemType: 'substituteadvanced' },
  distribute:         { displayLabel: 'Distribute',           category: 'Equation',  problemType: 'distribute' },
  solveforx:          { displayLabel: 'Solve for X',          category: 'Equation',  problemType: 'solveforx' },
  exponent:           { displayLabel: 'Exponent',             category: 'Equation',  problemType: 'exponent' },
  exponent2:          { displayLabel: 'Exponent (Advanced)',  category: 'Equation',  problemType: 'exponent2' },
  writeequation:      { displayLabel: 'Write Equation',       category: 'Equation',  problemType: 'writeequation' },

  // ── Quiz: Numbers ─────────────────────────────────────────────────────
  absolutevalue:  { displayLabel: 'Absolute Value',   category: 'Numbers', problemType: 'absolutevalue' },
  opposites:      { displayLabel: 'Opposites',        category: 'Numbers', problemType: 'opposites' },
  lcm:            { displayLabel: 'LCM',              category: 'Numbers', problemType: 'lcm' },
  gcf:            { displayLabel: 'GCF',              category: 'Numbers', problemType: 'gcf' },

  // ── Quiz: Statistics ──────────────────────────────────────────────────
  mean:               { displayLabel: 'Mean',               category: 'Statistics', problemType: 'mean' },
  median:             { displayLabel: 'Median',             category: 'Statistics', problemType: 'median' },
  mode:               { displayLabel: 'Mode',               category: 'Statistics', problemType: 'mode' },
  range:              { displayLabel: 'Range',              category: 'Statistics', problemType: 'range' },
  firstquartile:      { displayLabel: 'First Quartile',     category: 'Statistics', problemType: 'firstquartile' },
  thirdquartile:      { displayLabel: 'Third Quartile',     category: 'Statistics', problemType: 'thirdquartile' },
  interquartilerange: { displayLabel: 'Interquartile Range',category: 'Statistics', problemType: 'interquartilerange' },

  // ── Quiz: Geometry ────────────────────────────────────────────────────
  trapezoid:  { displayLabel: 'Trapezoid Area',  category: 'Geometry', problemType: 'trapezoid' },
  triangle:   { displayLabel: 'Triangle Area',   category: 'Geometry', problemType: 'triangle' },

  // ── Quiz2: Mixed Quiz problems ────────────────────────────────────────
  'quiz2-basic-fact':         { displayLabel: 'Basic Fact',           category: 'Quiz2', problemType: 'quiz2-basic-fact' },
  'quiz2-unknown':            { displayLabel: 'Unknown Factor',       category: 'Quiz2', problemType: 'quiz2-unknown' },
  'quiz2-distributive':       { displayLabel: 'Distributive',         category: 'Quiz2', problemType: 'quiz2-distributive' },
  'quiz2-single-digit-div':   { displayLabel: 'Single-Digit Division',category: 'Quiz2', problemType: 'quiz2-single-digit-div' },
  'quiz2-double-digit-div':   { displayLabel: 'Double-Digit Division',category: 'Quiz2', problemType: 'quiz2-double-digit-div' },
  'quiz2-percent-convert':    { displayLabel: 'Percent Convert',      category: 'Quiz2', problemType: 'quiz2-percent-convert' },
  'quiz2-fraction-convert':   { displayLabel: 'Fraction Convert',     category: 'Quiz2', problemType: 'quiz2-fraction-convert' },
  'quiz2-number-convert':     { displayLabel: 'Number Convert',       category: 'Quiz2', problemType: 'quiz2-number-convert' },
  'quiz2-percent-calc':       { displayLabel: 'Percent Calculation',  category: 'Quiz2', problemType: 'quiz2-percent-calc' },
  'quiz2-decimal-compare':    { displayLabel: 'Decimal Compare',      category: 'Quiz2', problemType: 'quiz2-decimal-compare' },
  'quiz2-fraction-compare':   { displayLabel: 'Fraction Compare',     category: 'Quiz2', problemType: 'quiz2-fraction-compare' },
  'quiz2-fraction-to-decimal': { displayLabel: 'Fraction to Decimal', category: 'Quiz2', problemType: 'quiz2-fraction-to-decimal' },
  'quiz2-decimal-to-fraction': { displayLabel: 'Decimal to Fraction', category: 'Quiz2', problemType: 'quiz2-decimal-to-fraction' },
  'quiz2-l-shape-area':       { displayLabel: 'L-Shape Area',         category: 'Quiz2', problemType: 'quiz2-l-shape-area' },
  'quiz2-square-area':        { displayLabel: 'Square Area/Perimeter',category: 'Quiz2', problemType: 'quiz2-square-area' },
  'quiz2-two-rectangles':     { displayLabel: 'Two Rectangles Area',  category: 'Quiz2', problemType: 'quiz2-two-rectangles' },
  'quiz2-triangle-area':      { displayLabel: 'Triangle Area',        category: 'Quiz2', problemType: 'quiz2-triangle-area' },
  'quiz2-parallelogram-area': { displayLabel: 'Parallelogram Area',   category: 'Quiz2', problemType: 'quiz2-parallelogram-area' },
  'quiz2-trapezoid-area':     { displayLabel: 'Trapezoid Area',       category: 'Quiz2', problemType: 'quiz2-trapezoid-area' },

  // ── Quiz3: Solve for N ────────────────────────────────────────────────
  'quiz3-solve-product':      { displayLabel: 'Solve Product',        category: 'Quiz3', problemType: 'quiz3-solve-product' },
  'quiz3-solve-division':     { displayLabel: 'Solve Division',       category: 'Quiz3', problemType: 'quiz3-solve-division' },
  'quiz3-solve-addition':     { displayLabel: 'Solve Addition',       category: 'Quiz3', problemType: 'quiz3-solve-addition' },
  'quiz3-solve-subtraction':  { displayLabel: 'Solve Subtraction',    category: 'Quiz3', problemType: 'quiz3-solve-subtraction' },
  'quiz3-fraction-times-n':   { displayLabel: 'Fraction Times N',     category: 'Quiz3', problemType: 'quiz3-fraction-times-n' },
  'quiz3-fraction-equation':  { displayLabel: 'Fraction Equation',    category: 'Quiz3', problemType: 'quiz3-fraction-equation' },
  'quiz3-n-over-denom':       { displayLabel: 'N Over Denominator',   category: 'Quiz3', problemType: 'quiz3-n-over-denom' },
  'quiz3-decimal-division':   { displayLabel: 'Decimal Division',     category: 'Quiz3', problemType: 'quiz3-decimal-division' },
  'quiz3-simplify-expr':      { displayLabel: 'Simplify Expression',  category: 'Quiz3', problemType: 'quiz3-simplify-expr' },
  'quiz3-distribute':         { displayLabel: 'Distribute',           category: 'Quiz3', problemType: 'quiz3-distribute' },

  // ── Canvas Components ─────────────────────────────────────────────────
  'number-line':       { displayLabel: 'Number Line',        category: 'Geometry', problemType: 'number-line' },
  'inequality':        { displayLabel: 'Inequality',         category: 'Geometry', problemType: 'inequality' },
  'coordinate-grid':   { displayLabel: 'Coordinate Grid',    category: 'Geometry', problemType: 'coordinate-grid' },
  'area-perimeter':    { displayLabel: 'Area & Perimeter',   category: 'Geometry', problemType: 'area-perimeter' },
};

/**
 * Maps quiz2 generator index (0–19) to its taxonomy key.
 */
export const QUIZ2_INDEX_TYPES: string[] = [
  'quiz2-basic-fact',          // 0
  'quiz2-unknown',             // 1
  'quiz2-distributive',        // 2
  'quiz2-single-digit-div',   // 3
  'quiz2-double-digit-div',   // 4
  'quiz2-percent-convert',    // 5
  'quiz2-fraction-convert',   // 6
  'quiz2-number-convert',     // 7
  'quiz2-percent-calc',       // 8
  'quiz2-decimal-compare',    // 9
  'quiz2-fraction-compare',   // 10
  'quiz2-fraction-to-decimal',// 11
  'quiz2-decimal-to-fraction',// 12
  'quiz2-l-shape-area',       // 13
  'quiz2-square-area',        // 14
  'quiz2-two-rectangles',     // 15
  'quiz2-triangle-area',      // 16
  'quiz2-parallelogram-area', // 17
  'quiz2-trapezoid-area',     // 18
  'quiz2-basic-fact',         // 19 (duplicate of slot 0)
];

/**
 * Maps quiz3 generator index (0–9) to its taxonomy key.
 */
export const QUIZ3_INDEX_TYPES: string[] = [
  'quiz3-solve-product',      // 0
  'quiz3-solve-division',     // 1
  'quiz3-solve-addition',     // 2
  'quiz3-solve-subtraction',  // 3
  'quiz3-fraction-times-n',   // 4
  'quiz3-fraction-equation',  // 5
  'quiz3-n-over-denom',       // 6
  'quiz3-decimal-division',   // 7
  'quiz3-simplify-expr',      // 8
  'quiz3-distribute',         // 9
];

/** Look up taxonomy or return a safe fallback */
export function getTaxonomy(key: string): ProblemTaxonomyEntry {
  return PROBLEM_TAXONOMY[key] ?? {
    displayLabel: key,
    category: 'Unknown',
    problemType: key,
  };
}
