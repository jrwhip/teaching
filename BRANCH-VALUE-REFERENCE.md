# Teaching App — Branch Value Reference

Extracted from 3 high-value branches + main. Source material for rebuilding as an AWS Amplify app.

---

## 1. Curriculum Taxonomy

Merged from `experimental` (42-type UI taxonomy) and `testing-class-problem-generation` (34 implemented generators). The experimental branch organizes types into 7 UI categories; the testing-class branch organizes generators into 6 code modules.

### Master Type List

| ID | Label | UI Category (experimental) | Generator Module (testing-class) | Has Generator? |
|----|-------|---------------------------|----------------------------------|----------------|
| `addition` | Addition | Basic Operations | Basics | Yes |
| `subtraction` | Subtraction | Basic Operations | Basics | Yes |
| `multiplication` | Multiplication | Basic Operations | Basics | Yes |
| `division` | Division | Basic Operations | Basics | Yes |
| `rounding` | Rounding | Number Concepts | Basics | Yes |
| `factfamily` | Fact Family | Basic Operations | — | **No** |
| `simplify` | Simplify Fractions | Fractions | Fractions | Yes |
| `impropertomixed` | Improper to Mixed | Fractions | Fractions | Yes |
| `mixedtoimproper` | Mixed to Improper | Fractions | Fractions | Yes |
| `addsubtractmixed` | Add/Subtract Mixed | Fractions | Fractions | Yes |
| `wholetimesmixed` | Whole x Mixed | Fractions | Fractions | Yes |
| `dividefractions` | Divide Fractions | Fractions | Fractions | Yes |
| `dividemixednumbers` | Divide Mixed Numbers | Fractions | Data (misplaced) | Yes |
| `comparefractions` | Compare Fractions | Fractions | Fractions | Yes (as `generateComparisonQuestion`) |
| `fractiontodecimal` | Fraction to Decimal | Fractions | Ratios (as `generateConvertQuestion`) | Yes (partial) |
| `decimaltofraction` | Decimal to Fraction | Fractions | Ratios (as `generateConvertQuestion`) | Yes (partial) |
| `translation` | Translate Expressions | Algebra | Equations | Yes |
| `unknown` | Unknown Variables | Algebra | Equations | Yes |
| `factor` | Factor | Algebra | Equations | Yes |
| `substitute` | Substitute | Algebra | — | **No** |
| `distribute` | Distribute | Algebra | Equations | Yes |
| `solveforx` | Solve for X | Algebra | Equations | Yes |
| `exponent` | Exponents | Algebra | Equations | Yes |
| `exponent2` | Exponents 2 | Algebra | Data (misplaced) | Yes |
| `mean` | Mean | Statistics | Data | Yes |
| `median` | Median | Statistics | Data | Yes |
| `mode` | Mode | Statistics | Data | Yes |
| `range` | Range | Statistics | Data | Yes |
| `firstquartile` | First Quartile | Statistics | Data | Yes |
| `thirdquartile` | Third Quartile | Statistics | Data | Yes |
| `interquartilerange` | Interquartile Range | Statistics | Data | Yes |
| `comparison` | Comparison | Number Concepts | Fractions (as `generateComparisonQuestion`) | Yes |
| `compareintegers` | Compare Integers | Number Concepts | — | **No** |
| `absolutevalue` | Absolute Value | Number Concepts | RationalNumbers | Yes |
| `opposites` | Opposites | Number Concepts | RationalNumbers | Yes |
| `convert` | Convert Percentage | Ratios & Percentages | Ratios | Yes |
| `percentofnumber` | Percent of Number | Ratios & Percentages | Ratios | Yes |
| `ratio` | Ratio | Ratios & Percentages | — | **No** |
| `solveratiotable` | Solve Ratio Table | Ratios & Percentages | Data (misplaced) | Yes |
| `unitrate` | Unit Rate | Ratios & Percentages | — | **No** |
| `lcm` | LCM | Other | RationalNumbers | Yes |
| `gcf` | GCF | Other | RationalNumbers | Yes |

### Additional generators without UI taxonomy entries

| Generator | Module | Notes |
|-----------|--------|-------|
| `generatePercentDecimalQuestion` | Ratios | Percent-to-decimal and decimal-to-percent conversion |
| `generateSolveXProblem` | RationalNumbers | Overlaps with `solveforx` from Equations — 6 sub-types |
| `generateWriteEquationProblem` | Data (misplaced) | Write equation from input/output table |

### Gap Summary

**5 taxonomy types have no generator:** `factfamily`, `substitute`, `compareintegers`, `ratio`, `unitrate`

**3 generators are misplaced in `data.ts`:** `generateDivideMixedNumbersProblem`, `generateExponent2Problem`, `generateSolveRatioTableProblem` — these belong in Fractions, Equations, and Ratios respectively.

---

## 2. Problem Generators

### Basics (5 functions) — `basics.ts`

| Function | Domain | Output |
|----------|--------|--------|
| `generateAdditionProblem()` | Decimal addition (0-3 decimal places, up to 900+90) | Problem with aligned-column hint |
| `generateSubtractionProblem()` | Decimal subtraction (ensures num1 > num2) | Problem with aligned-column hint |
| `generateMultiplicationProblem()` | 2-digit x 2-digit multiplication (15-94) | Problem with partial-products table hint |
| `generateDivisionProblem()` | 3-digit / 1-2 digit with rounding to tenth or hundredth | Problem with long-division hint |
| `generateRoundingProblem()` | Round to tens/hundreds/thousands/tenths/hundredths | Problem with place-value hint |

### Fractions (7 functions) — `fractions.ts`

| Function | Domain | Output |
|----------|--------|--------|
| `generateComparisonQuestion()` | Compare fractions or decimals (>, <, =) | Problem — handles both fraction and decimal comparison |
| `generateDivideFractionsProblem()` | Divide proper fractions, simplify result | Problem with reciprocal-multiply step table |
| `generateMixedToImproperProblem()` | Convert mixed number to simplified improper fraction | Problem with step-by-step conversion hint |
| `generateImproperToMixedProblem()` | Convert improper fraction to mixed number | Problem with division hint |
| `generateAddSubtractMixedProblem()` | Add or subtract mixed numbers with unlike denominators | Problem with LCM/borrowing hint |
| `generateSimplifyProblem()` | Simplify fraction using GCF | Problem — accepts whole number if denominator simplifies to 1 |
| `generateWholeTimesMixedProblem()` | Multiply whole number by mixed fraction | Problem with distribution hint |

### Equations (7 functions) — `equations.ts`

| Function | Domain | Output |
|----------|--------|--------|
| `generateSolveForXProblem()` | Evaluate `ax ± c` given x value | Problem |
| `generateExponentProblem()` | Calculate `base^exp` (base 2-9, exp 2-5) | Problem |
| `generateUnknownProblem()` | Distributive property missing-value (4 sub-types) | Problem |
| `generateFactorProblem()` | Factor or GCF-simplify expressions | Problem — randomly picks factoring vs distributing |
| `generateDistributeProblem()` | Distribute coefficient over binomial | Problem |
| `generateSolveXProblem()` | Solve for x in equations (6 sub-types: +, -, *, /, mixed) | Problem |
| `generateTranslationProblem()` | Translate word problems to algebraic equations (15 sub-types) | Problem — uses `n` as variable |

### Ratios (3 functions) — `ratios.ts`

| Function | Domain | Output |
|----------|--------|--------|
| `generatePercentDecimalQuestion()` | Convert between percent and decimal | Problem |
| `generateConvertQuestion()` | Convert between fraction and decimal | Problem with step table |
| `generatePercentOfNumberProblem()` | Calculate percent of a number (1-125%) | Problem with step table |

### RationalNumbers (4 functions) — `rational-numbers.ts`

| Function | Domain | Output |
|----------|--------|--------|
| `generateAbsoluteValueProblem()` | Absolute value, optionally negated (-10 to 10) | Problem |
| `generateOppositesProblem()` | Opposite or opposite-of-opposite (-10 to 10) | Problem |
| `generateLCMProblem()` | Least Common Multiple of two numbers | Problem — **BUG: answer is `helper.lcm.toString()` (function reference, not computed value)** |
| `generateGCFProblem()` | Greatest Common Factor using composite number construction | Problem |

### Data (10 functions) — `data.ts`

| Function | Domain | Notes |
|----------|--------|-------|
| `generateMeanProblem()` | Mean of 5-9 random numbers (1-20), round to hundredths | |
| `generateMedianProblem()` | Median of 5-9 random numbers (1-20) | |
| `generateModeProblem()` | Mode of 5-9 random numbers (1-20) | Accepts comma-separated for multi-mode |
| `generateRangeProblem()` | Range of 5-9 random numbers (1-20) | |
| `generateFirstQuartileProblem()` | Q1 of 7-11 random numbers (1-20) | |
| `generateThirdQuartileProblem()` | Q3 of 7-11 random numbers (1-20) | |
| `generateInterquartileRangeProblem()` | IQR of 7-11 random numbers (1-20) | |
| `generateWriteEquationProblem()` | Write equation from input/output table (add/sub/mult patterns) | **Misplaced — not statistics** |
| `generateSolveRatioTableProblem()` | Solve equivalent-fraction ratio table | **Misplaced — belongs in Ratios** |
| `generateDivideMixedNumbersProblem()` | Divide two mixed numbers | **Misplaced — belongs in Fractions** |
| `generateExponent2Problem()` | Exponent of fraction or decimal (exp 2-4) | **Misplaced — belongs in Equations** |

**Total: 36 generator functions across 6 files** (34 unique math domains + 2 overlap: `SolveForX`/`SolveX` and `Comparison` covers fractions+decimals)

---

## 3. Answer Validation

Two approaches exist across branches. They should be merged.

### Per-Problem Validators (testing-class)

Each `Problem` carries its own `ValidateFn: (userInput: string) => boolean`. This is the right pattern — validation logic lives next to generation logic where the answer structure is known.

**Common patterns in validators:**
- `parseFloat(userInput) === answer` — numeric comparison
- `userInput.trim() === answer` — exact string match
- Fraction parsing: split on `/`, compare numerator/denominator after simplification
- Mixed number parsing: regex `/^(\d+)(?:\s+(\d+)\/(\d+))?$/`
- Tolerance: `.toFixed(n)` string comparison for rounding problems

### Centralized Validators (student-teacher)

`UtilitiesService.checkAnswer()` dispatches by `questionType` string to specialized handlers:

| Handler | Question Types | Logic |
|---------|---------------|-------|
| `handleAddMixedCase` | `'add mixed'` | Parse mixed numbers, convert to improper, simplify, compare |
| `handleConvertCase` | `'convert'`, `'mixed-to-improper'` | Fraction simplification or float tolerance (0.001) |
| `handleImproperToMixedCase` | `'improper-to-mixed'` | Parse "whole num/den" format, exact match |
| `handleRoundingCase` | `'rounding'` | Extract precision from question text, compare `.toFixed(n)` |
| `handleDivideFractionsCase` | `'divide fractions'` | Simplify both fractions, compare |
| `handleComparisonCase` | `'comparison'` | Exact string match (>, <, =) |
| `handleDefaultCase` | Everything else | Float tolerance 0.01 |
| Direct match | `'factor'`, `'distribute'`, `'simplify'`, `'whole-times-mixed'`, `'translate'` | Normalized string equality |

**Additional utilities in UtilitiesService:**
- `parseMixedNumber(input)` → `MixedNumber { whole, numerator, denominator }`
- `compareMixedNumbers(a, b)` → boolean
- `convertMixedToImproper(mixedNumber)` → `{ numerator, denominator }`
- `simplifyFraction(num, den)` → `{ numerator, denominator }`
- `calculateGCF(a, b)` → number (recursive GCD)
- `calculateLCM(a, b)` → number
- `isImproperFraction(input)` → boolean
- `compareFractions(n1, d1, n2, d2)` → `'>' | '<' | '='`
- `compareDecimals(a, b)` → `'>' | '<' | '='`
- `decimalToFrac(decimal)` → string (over denominator 100)

### Recommendation

Use per-problem `ValidateFn` as the primary pattern (from testing-class). Port the edge-case handling from `UtilitiesService` into shared helper functions that generators can compose into their validators:
- `parseMixedNumber` / `compareMixedNumbers` for mixed-number problems
- `simplifyFraction` comparison for any fraction answer
- `toFixed(n)` comparison for rounding/decimal problems
- `normalizeInput` (trim + whitespace collapse + lowercase) as a preprocessor

---

## 4. Data Models

### Problem (testing-class) — the core model

```typescript
type ValidateFn = (userInput: string) => boolean;

class Problem {
  question: string;
  answer: string;
  validate: ValidateFn;
  hint: string;
}
```

### ExtendedProblem (testing-class) — adds video references

```typescript
class ExtendedProblem extends Problem {
  videoIds: { teaching: string; example: string; };
  operation: string;
}
```

**Note:** The constructor only looks up `operationLookup['Basics'][operation]`, which means it only works for Basics operations. The static `operationLookup` has the same bug. The full lookup map covers all categories — the constructor needs to accept a category parameter.

### CounterValues (student-teacher) — performance tracking

```typescript
interface CounterValues {
  label: string;
  correct: number;
  incorrect: number;
  streak: number;
  highStreak: number;
}
```

### MixedNumber (student-teacher)

```typescript
class MixedNumber {
  constructor(
    public whole: number,
    public numerator: number,
    public denominator: number
  ) {}
}
```

### MathQuestion (student-teacher)

```typescript
interface MathQuestion {
  question: string;
  answer: string;
  hint: string[];
}
```

**Note:** `Problem` from testing-class supersedes this — it has `ValidateFn` and a single hint string (hints are HTML). The `hint: string[]` array in MathQuestion was a placeholder.

### StudentAnswer (student-teacher)

```typescript
interface StudentAnswer {
  isCorrect: boolean;
  answer: string | number;
}
```

### Shape Dimension Interfaces (experimental)

```typescript
interface RectangleDimensions   { width: number; height: number; }
interface SquareDimensions      { side: number; }
interface TriangleDimensions    { base: number; height: number; sideA: number; sideB: number; }
interface TrapezoidDimensions   { base1: number; base2: number; height: number; sideTrapA: number; sideTrapB: number; }
interface TwoRectanglesDimensions { width1: number; width2: number; height: number; }
interface IrregularLDimensions  { rect1Width: number; rect1Height: number; rect2Width: number; rect2Height: number; alignSide: 'left' | 'right'; }
type ShapeDimensions = RectangleDimensions | SquareDimensions | TriangleDimensions |
                       TrapezoidDimensions | TwoRectanglesDimensions | IrregularLDimensions;
```

### State Model (student-teacher) — reference only

```typescript
interface CurrentUser { id: string; name: string; email: string; }
interface CounterData { [key: string]: CounterValues; }
interface StoredMathQuestions { [key: string]: MathQuestion; }

class State {
  isLoading: boolean;
  userRole: string | null;        // Replaced by Amplify Cognito groups
  currentUser: CurrentUser | null; // Replaced by Amplify Auth
  storedMathQuestions: StoredMathQuestions | null;
  counterData: CounterData | null;
}
```

---

## 5. Interactive Components

### InequalityComponent (experimental)

**Purpose:** Graph an inequality on a number line (-10 to 10).

**Algorithm:**
1. Generate random target value (-10 to 10) and inequality symbol (>, >=, <, <=)
2. Student selects circle type (open = strict, closed = inclusive)
3. Student selects direction (left or right)
4. Student clicks number line to place marker at nearest tick
5. Validation checks three conditions: correct position, correct circle type, correct direction
6. Visual feedback: marker circle, shaded line segment, directional arrow

**Types:** `CircleType = 'open' | 'closed'`, `Direction = 'left' | 'right'`, `InequalitySymbol = '>' | '>=' | '<' | '<='`

**Key logic:** `calculateStep()` computes pixel spacing from container width / 20 ticks. `drawLine()` extends from marker to edge of container in the chosen direction. `handleClick()` snaps to nearest tick via `Math.round(x / step)`.

### AreaComponent (experimental)

**Purpose:** Calculate area or perimeter of 6 shape types with canvas-drawn diagrams.

**Algorithm:**
1. Student selects shape type from menu
2. System generates random dimensions (integer values, typically 4-12 or 5-20)
3. Canvas draws the shape with labeled dimension annotations
4. Randomly asks for area or perimeter (triangles and trapezoids always ask area)
5. Student enters answer with unit suffix (u² for area, u for perimeter)
6. Provides formula hints per shape and step-by-step solution on incorrect answer

**Shapes and formulas:**
- Rectangle: A = w*h, P = 2(w+h)
- Square: A = s², P = 4s
- Triangle: A = ½bh, P = b+sA+sB
- Trapezoid: A = ½(b1+b2)*h, P = b1+b2+sA+sB
- Two Rectangles Side-by-Side: A = (w1+w2)*h, P = 2h+2(w1+w2)
- Irregular L-Shape: A = r1w*r1h + r2w*r2h, P = all outer edges (left or right aligned)

### PlotPointsComponent (experimental)

**Purpose:** Place two points on a number line and calculate their distance.

**Algorithm:**
1. Generate two distinct random integers (-10 to 10)
2. Student clicks number line to place markers (clicking existing marker removes it)
3. Student enters distance between points
4. Validation: markers must match target points (order-independent), distance must equal `|A - B|`
5. Position calculated as percentage: `((value - start) / (end - start)) * 100%`

---

## 6. Video ID Map

Extracted from `ExtendedProblem.operationLookup`. YouTube video IDs for teaching and worked-example videos per operation.

### Basics

| Operation | Teaching Video | Example Video |
|-----------|---------------|---------------|
| addition | `WwKLA-6S-e0` | `1xXibPhF3bw` |
| subtraction | `a8tCGNB-vOk` | `w6LfGwslhlw` |
| multiplication | `PZjIT9CH6bM` | `hV3RstrYGEA` |
| division | `lGEdO4cr_TA` | `rXjV74suB68` |
| rounding | `KqBJBMEqrZc` | — |

### Ratios

| Operation | Teaching Video | Example Video |
|-----------|---------------|---------------|
| percentDecimal | `jPmno8_2zi0` | — |
| percentofnumber | `AL0-0f9azNo` | — |
| convert | `guBVW5PiHLs` | — |

### Fractions

| Operation | Teaching Video | Example Video |
|-----------|---------------|---------------|
| simplify | `4CKDqvddhhg` | — |
| wholetimesmixed | `4JV6fPXZPXA` | — |
| dividefractions | `1YWyTdtofdE` | `cARsEw-s8Fg` |
| comparison | `u_QTuWj107o` | — |

### Equations

| Operation | Teaching Video | Example Video |
|-----------|---------------|---------------|
| unknown | — | — |
| solveforx | `Qa-MCLDrSlI` | — |
| writeequation | `o_Ubm7OI8t4` | — |

### RationalNumbers

| Operation | Teaching Video | Example Video |
|-----------|---------------|---------------|
| translation | `w6LfGwslhlw` | `w6LfGwslhlw` |
| solvex | `Qa-MCLDrSlI` | — |
| factor | `-y0-vf0zsMg` | — |
| distribute | `CTw40jSAUx0` | — |
| exponent | `NS4vHqJIPiE` | — |
| exponent2 | `CTw40jSAUx0` | `MP3viJTn-e4` |
| lcm | `53Ed5yjBELc` | — |
| gcf | `crWLFqOQtBA` | — |
| opposites | `GJTI6y0ZKWE` | — |
| absolutevalue | `NNsdEV0jJqM` | — |
| solveratiotable | `6uwnkOC5hLI` | — |
| addsubtractmixed | `h7Vs7uUPZrE` | — |
| dividemixednumbers | `cARsEw-s8Fg` | — |
| mixed-to-improper | `96NOYcnmThU` | — |
| improper-to-mixed | `EpXCr2iax5E` | — |

### Data

| Operation | Teaching Video | Example Video |
|-----------|---------------|---------------|
| mean | `H7u0Zrra060` | — |
| median | `Y7M_KNwIZvw` | — |
| mode | `dyQ-leIVuRI` | — |
| range | `0HS1P3vhNBU` | — |
| firstquartile | `oPw2OpIZ4DY` | — |
| thirdquartile | `oPw2OpIZ4DY` | — |
| interquartilerange | `VABsJBw1JqA` | — |

---

## 7. Word Study Data

Source: `src/app/word.service.ts` (identical across all branches)

### Structure

```
{
  [sectionKey: string]: {
    [patternKey: string]: string[]
  }
}
```

### Sections and Patterns

| Section | Patterns | Total Words (approx) |
|---------|----------|---------------------|
| `mixed-short` | `a`, `i`, `o`, `e`, `u` | ~60 |
| `core-a` | `a_`, `a_e`, `ar`, `ai` | ~110 |
| `core-i` | `i_`, `i_e`, `ir`, `igh` | ~95 |
| `core-o` | `o_`, `o_e`, `or`, `oa` | ~90 |
| `core-e` | `e_`, `ee`, `er`, `ea` | ~100 |
| `core-u` | `u_`, `u_e`, `ur`, `ue` | ~60 |
| `ending-sorts` | `ed`, `d`, `t` | ~130 (base+past-tense pairs) |
| `addl-a` | `ay`, `all`, `aw` | ~40 |
| `addl-i` | `ing`, `i`, `y_like_i` | ~30 |
| `addl-o` | `rule`, `oi`, `oo`, `ow`, `oy`, `oo2`, `ow2`, `ou` | ~110 |
| `addl-e` | `ea`, `ear`, `er_e`, `ew` | ~40 |
| `addl-u` | `ur_e` | ~7 |

**Total: ~870 words across 12 sections, 42 phonics patterns**

The pattern keys represent phonics rules (e.g., `a_e` = long-a with silent-e, `ar` = r-controlled a, `igh` = long-i trigraph). The `ending-sorts` section contains base-word/past-tense pairs grouped by the sound of the `-ed` ending.

---

## 8. Known Bugs

### Critical

| Bug | Location | Description |
|-----|----------|-------------|
| **LCM answer is function reference** | `rational-numbers.ts:generateLCMProblem()` | Answer is set to `helper.lcm.toString()` which returns the function source code, not the computed LCM value. Should be `helper.calculateLCM(num1, num2).toString()`. |
| **ExtendedProblem only reads Basics** | `extended-problem.model.ts` constructor | `operationLookup['Basics'][operation]` — will throw for any non-Basics operation. Constructor and static method need a `category` parameter. |

### Architectural

| Bug | Location | Description |
|-----|----------|-------------|
| **4 generators misplaced in data.ts** | `data.ts` | `generateWriteEquationProblem`, `generateSolveRatioTableProblem`, `generateDivideMixedNumbersProblem`, `generateExponent2Problem` are not statistics/data problems. They belong in Equations, Ratios, Fractions, and Equations respectively. |
| **Duplicate solve-for-x generators** | `equations.ts` + `rational-numbers.ts` (via operationLookup) | `generateSolveForXProblem` (evaluate expression given x) and `generateSolveXProblem` (isolate x in equation) overlap in name and concept but are different problems. Naming should distinguish "evaluate" vs "solve". |
| **Translation problem case 2 has double assignment** | `equations.ts:generateTranslationProblem()` | Case 2 sets `answer` twice — first to `n + ${num1} = ${num2}` then immediately overwrites to `${num2} - n = ${num1}`. The first answer is lost. |

### Validation

| Bug | Location | Description |
|-----|----------|-------------|
| **Inconsistent fraction validation** | Various generators | Some validators accept simplified fractions, others require exact match. No consistent policy. |
| **Translation validator uses raw `userInput`** | `equations.ts:generateTranslationProblem()` | The `validateFn` sometimes compares `normalizedInput` vs `normalizedAnswer` and sometimes `userInput === answer` (with spaces). Inconsistent. |
| **Comparison question generates equal fractions rarely** | `fractions.ts:generateComparisonQuestion()` | Denominator is constrained to `>= numerator`, making `=` answers rare for fractions. The decimal path can generate equal values. |

### UI/Hints

| Bug | Location | Description |
|-----|----------|-------------|
| **Inline styles in hints** | `basics.ts` (all generators) | `<style>` blocks embedded in hint strings. These will leak into the DOM and affect other elements. Should use classes or inline styles on individual elements only. |
| **Ratio table column header says "Column 10"** | `data.ts:generateSolveRatioTableProblem()` | Should be "Column 1". |
| **AddSubtractMixed hint step numbering** | `fractions.ts:generateAddSubtractMixedProblem()` | The hint header says "Step 5" but step count is conditional on borrowing. The numbering logic works but the header is always wrong. |

### Word Study Data

| Bug | Location | Description |
|-----|----------|-------------|
| **Typo: "skale"** | `word.service.ts` → `core-a` → `a_e` | Should be "scale". |
| **Duplicate words in `a_e`** | `word.service.ts` → `core-a` → `a_e` | `late`, `made`, `make`, `name`, `page`, `rake` each appear twice. |
| **Duplicate "fall"** | `word.service.ts` → `addl-a` → `all` | `fall` appears twice. |
| **Duplicate "now"** | `word.service.ts` → `addl-o` → `ow2` | `now` appears twice. |
