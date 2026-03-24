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
  /** Difficulty 1–5 (1 = easiest, 5 = hardest) */
  difficulty: number;
  /** Grade level 0–6 (0 = K, 1 = 1st, ..., 6 = 6th) */
  gradeLevel: number;
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
  addition:        { displayLabel: 'Addition',          category: 'Basics',     problemType: 'addition',        difficulty: 1, gradeLevel: 3 },
  subtraction:     { displayLabel: 'Subtraction',       category: 'Basics',     problemType: 'subtraction',     difficulty: 1, gradeLevel: 3 },
  multiplication:  { displayLabel: 'Multiplication',    category: 'Basics',     problemType: 'multiplication',  difficulty: 2, gradeLevel: 3 },
  division:        { displayLabel: 'Division',          category: 'Basics',     problemType: 'division',        difficulty: 2, gradeLevel: 3 },
  rounding:        { displayLabel: 'Rounding',          category: 'Basics',     problemType: 'rounding',        difficulty: 1, gradeLevel: 3 },
  factfamily:      { displayLabel: 'Fact Family',       category: 'Basics',     problemType: 'factfamily',      difficulty: 2, gradeLevel: 3 },

  // ── Quiz: Fractions ───────────────────────────────────────────────────
  simplify:            { displayLabel: 'Simplify Fractions',        category: 'Fractions', problemType: 'simplify',            difficulty: 2, gradeLevel: 4 },
  addsubtractmixed:    { displayLabel: 'Add/Subtract Mixed',        category: 'Fractions', problemType: 'addsubtractmixed',    difficulty: 3, gradeLevel: 5 },
  mixedtoimproper:     { displayLabel: 'Mixed to Improper',         category: 'Fractions', problemType: 'mixedtoimproper',     difficulty: 2, gradeLevel: 4 },
  impropertomixed:     { displayLabel: 'Improper to Mixed',         category: 'Fractions', problemType: 'impropertomixed',     difficulty: 2, gradeLevel: 4 },
  wholetimesmixed:     { displayLabel: 'Whole Times Mixed',         category: 'Fractions', problemType: 'wholetimesmixed',     difficulty: 3, gradeLevel: 5 },
  dividefractions:     { displayLabel: 'Divide Fractions',          category: 'Fractions', problemType: 'dividefractions',     difficulty: 3, gradeLevel: 6 },
  dividemixednumbers:  { displayLabel: 'Divide Mixed Numbers',      category: 'Fractions', problemType: 'dividemixednumbers',  difficulty: 4, gradeLevel: 6 },
  fractiontodecimal:   { displayLabel: 'Fraction to Decimal',       category: 'Fractions', problemType: 'fractiontodecimal',   difficulty: 2, gradeLevel: 5 },
  decimaltofraction:   { displayLabel: 'Decimal to Fraction',       category: 'Fractions', problemType: 'decimaltofraction',   difficulty: 2, gradeLevel: 5 },

  // ── Quiz: Compare ─────────────────────────────────────────────────────
  comparefractions:  { displayLabel: 'Compare Fractions',   category: 'Compare', problemType: 'comparefractions',  difficulty: 2, gradeLevel: 4 },
  comparison:        { displayLabel: 'Compare Decimals',    category: 'Compare', problemType: 'comparison',        difficulty: 2, gradeLevel: 5 },
  compareintegers:   { displayLabel: 'Compare Integers',    category: 'Compare', problemType: 'compareintegers',   difficulty: 1, gradeLevel: 6 },

  // ── Quiz: Percent ─────────────────────────────────────────────────────
  convert:          { displayLabel: 'Percent Convert',      category: 'Percent', problemType: 'convert',          difficulty: 2, gradeLevel: 5 },
  percentofnumber:  { displayLabel: 'Percent of Number',    category: 'Percent', problemType: 'percentofnumber',  difficulty: 3, gradeLevel: 6 },

  // ── Quiz: Ratios ──────────────────────────────────────────────────────
  ratio:            { displayLabel: 'Ratio',                category: 'Ratios',   problemType: 'ratio',            difficulty: 2, gradeLevel: 6 },
  solveratiotable:  { displayLabel: 'Ratio Table',          category: 'Ratios',   problemType: 'solveratiotable',  difficulty: 3, gradeLevel: 6 },
  unitrate:         { displayLabel: 'Unit Rate',            category: 'Ratios',   problemType: 'unitrate',         difficulty: 3, gradeLevel: 6 },

  // ── Quiz: Equation ────────────────────────────────────────────────────
  translation:        { displayLabel: 'Translation',          category: 'Equation',  problemType: 'translation',        difficulty: 2, gradeLevel: 6 },
  unknown:            { displayLabel: 'Unknown',              category: 'Equation',  problemType: 'unknown',            difficulty: 2, gradeLevel: 4 },
  factor:             { displayLabel: 'Factor',               category: 'Equation',  problemType: 'factor',             difficulty: 3, gradeLevel: 6 },
  substitute:         { displayLabel: 'Substitute',           category: 'Equation',  problemType: 'substitute',         difficulty: 2, gradeLevel: 6 },
  substituteadvanced: { displayLabel: 'Substitute (Advanced)',category: 'Equation',  problemType: 'substituteadvanced', difficulty: 4, gradeLevel: 6 },
  distribute:         { displayLabel: 'Distribute',           category: 'Equation',  problemType: 'distribute',         difficulty: 3, gradeLevel: 6 },
  solveforx:          { displayLabel: 'Solve for X',          category: 'Equation',  problemType: 'solveforx',          difficulty: 4, gradeLevel: 6 },
  exponent:           { displayLabel: 'Exponent',             category: 'Equation',  problemType: 'exponent',           difficulty: 3, gradeLevel: 6 },
  exponent2:          { displayLabel: 'Exponent (Advanced)',  category: 'Equation',  problemType: 'exponent2',          difficulty: 4, gradeLevel: 6 },
  writeequation:      { displayLabel: 'Write Equation',       category: 'Equation',  problemType: 'writeequation',      difficulty: 3, gradeLevel: 6 },

  // ── Quiz: Numbers ─────────────────────────────────────────────────────
  absolutevalue:  { displayLabel: 'Absolute Value',   category: 'Numbers', problemType: 'absolutevalue',  difficulty: 1, gradeLevel: 6 },
  opposites:      { displayLabel: 'Opposites',        category: 'Numbers', problemType: 'opposites',      difficulty: 1, gradeLevel: 6 },
  lcm:            { displayLabel: 'LCM',              category: 'Numbers', problemType: 'lcm',            difficulty: 3, gradeLevel: 6 },
  gcf:            { displayLabel: 'GCF',              category: 'Numbers', problemType: 'gcf',            difficulty: 3, gradeLevel: 6 },

  // ── Quiz: Statistics ──────────────────────────────────────────────────
  mean:               { displayLabel: 'Mean',               category: 'Statistics', problemType: 'mean',               difficulty: 2, gradeLevel: 6 },
  median:             { displayLabel: 'Median',             category: 'Statistics', problemType: 'median',             difficulty: 2, gradeLevel: 6 },
  mode:               { displayLabel: 'Mode',               category: 'Statistics', problemType: 'mode',               difficulty: 1, gradeLevel: 6 },
  range:              { displayLabel: 'Range',              category: 'Statistics', problemType: 'range',              difficulty: 1, gradeLevel: 6 },
  firstquartile:      { displayLabel: 'First Quartile',     category: 'Statistics', problemType: 'firstquartile',      difficulty: 3, gradeLevel: 6 },
  thirdquartile:      { displayLabel: 'Third Quartile',     category: 'Statistics', problemType: 'thirdquartile',      difficulty: 3, gradeLevel: 6 },
  interquartilerange: { displayLabel: 'Interquartile Range',category: 'Statistics', problemType: 'interquartilerange', difficulty: 4, gradeLevel: 6 },

  // ── Quiz: Geometry ────────────────────────────────────────────────────
  trapezoid:  { displayLabel: 'Trapezoid Area',  category: 'Geometry', problemType: 'trapezoid',  difficulty: 3, gradeLevel: 6 },
  triangle:   { displayLabel: 'Triangle Area',   category: 'Geometry', problemType: 'triangle',   difficulty: 2, gradeLevel: 6 },

  // ── Quiz2: Mixed Quiz problems ────────────────────────────────────────
  'quiz2-basic-fact':         { displayLabel: 'Basic Fact',           category: 'Quiz2', problemType: 'quiz2-basic-fact',         difficulty: 1, gradeLevel: 3 },
  'quiz2-unknown':            { displayLabel: 'Unknown Factor',       category: 'Quiz2', problemType: 'quiz2-unknown',            difficulty: 2, gradeLevel: 4 },
  'quiz2-distributive':       { displayLabel: 'Distributive',         category: 'Quiz2', problemType: 'quiz2-distributive',       difficulty: 3, gradeLevel: 6 },
  'quiz2-single-digit-div':   { displayLabel: 'Single-Digit Division',category: 'Quiz2', problemType: 'quiz2-single-digit-div',  difficulty: 1, gradeLevel: 3 },
  'quiz2-double-digit-div':   { displayLabel: 'Double-Digit Division',category: 'Quiz2', problemType: 'quiz2-double-digit-div',  difficulty: 2, gradeLevel: 4 },
  'quiz2-percent-convert':    { displayLabel: 'Percent Convert',      category: 'Quiz2', problemType: 'quiz2-percent-convert',    difficulty: 2, gradeLevel: 5 },
  'quiz2-fraction-convert':   { displayLabel: 'Fraction Convert',     category: 'Quiz2', problemType: 'quiz2-fraction-convert',   difficulty: 2, gradeLevel: 5 },
  'quiz2-number-convert':     { displayLabel: 'Number Convert',       category: 'Quiz2', problemType: 'quiz2-number-convert',     difficulty: 2, gradeLevel: 5 },
  'quiz2-percent-calc':       { displayLabel: 'Percent Calculation',  category: 'Quiz2', problemType: 'quiz2-percent-calc',       difficulty: 3, gradeLevel: 6 },
  'quiz2-decimal-compare':    { displayLabel: 'Decimal Compare',      category: 'Quiz2', problemType: 'quiz2-decimal-compare',    difficulty: 2, gradeLevel: 5 },
  'quiz2-fraction-compare':   { displayLabel: 'Fraction Compare',     category: 'Quiz2', problemType: 'quiz2-fraction-compare',   difficulty: 2, gradeLevel: 4 },
  'quiz2-fraction-to-decimal': { displayLabel: 'Fraction to Decimal', category: 'Quiz2', problemType: 'quiz2-fraction-to-decimal',difficulty: 2, gradeLevel: 5 },
  'quiz2-decimal-to-fraction': { displayLabel: 'Decimal to Fraction', category: 'Quiz2', problemType: 'quiz2-decimal-to-fraction',difficulty: 2, gradeLevel: 5 },
  'quiz2-l-shape-area':       { displayLabel: 'L-Shape Area',         category: 'Quiz2', problemType: 'quiz2-l-shape-area',       difficulty: 3, gradeLevel: 5 },
  'quiz2-square-area':        { displayLabel: 'Square Area/Perimeter',category: 'Quiz2', problemType: 'quiz2-square-area',        difficulty: 1, gradeLevel: 4 },
  'quiz2-two-rectangles':     { displayLabel: 'Two Rectangles Area',  category: 'Quiz2', problemType: 'quiz2-two-rectangles',     difficulty: 2, gradeLevel: 5 },
  'quiz2-triangle-area':      { displayLabel: 'Triangle Area',        category: 'Quiz2', problemType: 'quiz2-triangle-area',      difficulty: 2, gradeLevel: 6 },
  'quiz2-parallelogram-area': { displayLabel: 'Parallelogram Area',   category: 'Quiz2', problemType: 'quiz2-parallelogram-area', difficulty: 2, gradeLevel: 6 },
  'quiz2-trapezoid-area':     { displayLabel: 'Trapezoid Area',       category: 'Quiz2', problemType: 'quiz2-trapezoid-area',     difficulty: 3, gradeLevel: 6 },

  // ── Quiz3: Solve for N ────────────────────────────────────────────────
  'quiz3-solve-product':      { displayLabel: 'Solve Product',        category: 'Quiz3', problemType: 'quiz3-solve-product',      difficulty: 2, gradeLevel: 4 },
  'quiz3-solve-division':     { displayLabel: 'Solve Division',       category: 'Quiz3', problemType: 'quiz3-solve-division',     difficulty: 2, gradeLevel: 4 },
  'quiz3-solve-addition':     { displayLabel: 'Solve Addition',       category: 'Quiz3', problemType: 'quiz3-solve-addition',     difficulty: 1, gradeLevel: 3 },
  'quiz3-solve-subtraction':  { displayLabel: 'Solve Subtraction',    category: 'Quiz3', problemType: 'quiz3-solve-subtraction',  difficulty: 1, gradeLevel: 3 },
  'quiz3-fraction-times-n':   { displayLabel: 'Fraction Times N',     category: 'Quiz3', problemType: 'quiz3-fraction-times-n',   difficulty: 3, gradeLevel: 5 },
  'quiz3-fraction-equation':  { displayLabel: 'Fraction Equation',    category: 'Quiz3', problemType: 'quiz3-fraction-equation',  difficulty: 3, gradeLevel: 6 },
  'quiz3-n-over-denom':       { displayLabel: 'N Over Denominator',   category: 'Quiz3', problemType: 'quiz3-n-over-denom',       difficulty: 3, gradeLevel: 6 },
  'quiz3-decimal-division':   { displayLabel: 'Decimal Division',     category: 'Quiz3', problemType: 'quiz3-decimal-division',   difficulty: 3, gradeLevel: 5 },
  'quiz3-simplify-expr':      { displayLabel: 'Simplify Expression',  category: 'Quiz3', problemType: 'quiz3-simplify-expr',      difficulty: 3, gradeLevel: 6 },
  'quiz3-distribute':         { displayLabel: 'Distribute',           category: 'Quiz3', problemType: 'quiz3-distribute',         difficulty: 3, gradeLevel: 6 },

  // ── Canvas Components ─────────────────────────────────────────────────
  'number-line':       { displayLabel: 'Number Line',        category: 'Geometry', problemType: 'number-line',       difficulty: 2, gradeLevel: 6 },
  'inequality':        { displayLabel: 'Inequality',         category: 'Geometry', problemType: 'inequality',        difficulty: 3, gradeLevel: 6 },
  'coordinate-grid':   { displayLabel: 'Coordinate Grid',    category: 'Geometry', problemType: 'coordinate-grid',   difficulty: 2, gradeLevel: 5 },
  'area-perimeter':    { displayLabel: 'Area & Perimeter',   category: 'Geometry', problemType: 'area-perimeter',    difficulty: 2, gradeLevel: 4 },
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
    difficulty: 2,
    gradeLevel: 5,
  };
}
