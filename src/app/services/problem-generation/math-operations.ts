export type ProblemCategory =
  | 'Basics'
  | 'Ratios'
  | 'Fractions'
  | 'Equations'
  | 'RationalNumbers'
  | 'Data';

export interface OperationMetadata {
  problemGenerateFn: string;
  teachingVideoId: string;
  exampleVideoId: string;
  label: string;
  path: string;
}

export interface CategoryDetail {
  label: string;
  path: string;
  operations: { [operation: string]: OperationMetadata };
}
// /////////////////////////////////////////////////////////////////
// TODO: REPLACE ALL 8GXzCVIvMH0 with the correct video ID ////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////
export const operationLookup: {
  [category in ProblemCategory]: CategoryDetail;
} = {
  // TODO: This data needs to be corrected. The problemGenerateFn values are not correct.
  Basics: {
    label: 'Basics',
    path: 'basics',
    operations: {
      addition: {
        label: 'Addition',
        path: 'addition',
        problemGenerateFn: 'Basics.generateAdditionProblem',
        teachingVideoId: 'WwKLA-6S-e0',
        exampleVideoId: '1xXibPhF3bw',
      },
      subtraction: {
        label: 'Subtraction',
        path: 'subtraction',
        problemGenerateFn: 'Basics.generateSubtractionProblem',
        teachingVideoId: 'a8tCGNB-vOk',
        exampleVideoId: 'w6LfGwslhlw',
      },
      multiplication: {
        label: 'Multiplication',
        path: 'multiplication',
        problemGenerateFn: 'Basics.generateMultiplicationProblem',
        teachingVideoId: 'PZjIT9CH6bM',
        exampleVideoId: 'hV3RstrYGEA',
      },
      division: {
        label: 'Division',
        path: 'division',
        problemGenerateFn: 'Basics.generateDivisionProblem',
        teachingVideoId: 'lGEdO4cr_TA',
        exampleVideoId: 'rXjV74suB68',
      },
      rounding: {
        label: 'Rounding',
        path: 'rounding',
        problemGenerateFn: 'Basics.generateRoundingProblem',
        teachingVideoId: 'KqBJBMEqrZc',
        exampleVideoId: '',
      },
    },
  },
  Ratios: {
    label: 'Ratios',
    path: 'ratios',
    operations: {
      percentDecimal: {
        label: 'Percent to Decimal',
        path: 'percent-decimal',
        problemGenerateFn: 'Ratios.generatePercentDecimalQuestion',
        teachingVideoId: 'jPmno8_2zi0',
        exampleVideoId: '',
      },
      percentofnumber: {
        label: 'Percent of Number',
        path: 'percent-of-number',
        problemGenerateFn: 'Ratios.generatePercentOfNumberProblem',
        teachingVideoId: 'AL0-0f9azNo',
        exampleVideoId: '',
      },
      convert: {
        label: 'Convert',
        path: 'convert',
        problemGenerateFn: 'Ratios.generateConvertQuestion',
        teachingVideoId: 'guBVW5PiHLs',
        exampleVideoId: '',
      },
    },
  },
  Fractions: {
    label: 'Fractions',
    path: 'fractions',
    operations: {
      simplify: {
        label: 'Simplify',
        path: 'simplify',
        problemGenerateFn: 'Fractions.generateSimplifyProblem',
        teachingVideoId: '4CKDqvddhhg',
        exampleVideoId: '',
      },
      wholetimesmixed: {
        label: 'Whole Times Mixed',
        path: 'whole-times-mixed',
        problemGenerateFn: 'Fractions.generateWholeTimesMixedProblem',
        teachingVideoId: '4JV6fPXZPXA',
        exampleVideoId: '',
      },
      dividefractions: {
        label: 'Divide Fractions',
        path: 'divide-fractions',
        problemGenerateFn: 'Fractions.generateDivideFractionsProblem',
        teachingVideoId: '1YWyTdtofdE',
        exampleVideoId: 'cARsEw-s8Fg',
      },
      comparison: {
        label: 'Comparison',
        path: 'comparison',
        problemGenerateFn: 'Fractions.generateComparisonQuestion',
        teachingVideoId: 'u_QTuWj107o',
        exampleVideoId: '',
      },
      mixedToimproper: {
        label: 'Mixed to Improper',
        path: 'mixed-to-improper',
        problemGenerateFn: 'Fractions.generateMixedToImproperProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
      impropertomixed: {
        label: 'Improper to Mixed',
        path: 'improper-to-mixed',
        problemGenerateFn: 'Fractions.generateImproperToMixedProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
      addSubtractmixed: {
        label: 'Add Subtract Mixed',
        path: 'add-subtract-mixed',
        problemGenerateFn: 'Fractions.generateAddSubtractMixedProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
    },
  },
  Equations: {
    label: 'Equations',
    path: 'equations',
    operations: {
      unknown: {
        label: 'Unknown',
        path: 'unknown',
        problemGenerateFn: 'Equations.generateUnknownProblem',
        teachingVideoId: '',
        exampleVideoId: '',
      },
      solveforx: {
        label: 'Solve for X',
        path: 'solve-for-x',
        problemGenerateFn: 'Equations.generateSolveForXProblem',
        teachingVideoId: 'Qa-MCLDrSlI',
        exampleVideoId: '',
      },
      // TODO: FIND THIS. DOESN'T EXIST IN EQUATIONS.TS
      // writeequation: {
      //   label: 'Write Equation',
      //   path: 'write-equation',
      //   problemGenerateFn: 'problemGenerateFnWriteEquationProblem',
      //   teachingVideoId: 'o_Ubm7OI8t4',
      //   exampleVideoId: '',
      // },
      exponent: {
        label: 'Exponent',
        path: 'exponent',
        problemGenerateFn: 'Equations.generateExponentProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
      factor: {
        label: 'Factor',
        path: 'factor',
        problemGenerateFn: 'Equations.generateFactorProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
      distribute: {
        label: 'Distribute',
        path: 'distribute',
        problemGenerateFn: 'Equations.generateDistributeProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
      solvex: {
        label: 'Solve X',
        path: 'solve-x',
        problemGenerateFn: 'Equations.generateSolveXProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
      translation: {
        label: 'Translation',
        path: 'translation',
        problemGenerateFn: 'Equations.generateTranslationProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
    },
  },
  RationalNumbers: {
    label: 'Rational Numbers',
    path: 'rational-numbers',
    operations: {
      // TODO: FIND THESE. THEY DON'T EXIST IN RATIONAL-NUMBERS.TS
      // translation: {
      //   label: 'Translation',
      //   path: 'translation',
      //   problemGenerateFn: 'problemGenerateFnTranslationProblem',
      //   teachingVideoId: 'w6LfGwslhlw',
      //   exampleVideoId: 'w6LfGwslhlw',
      // },
      // solvex: {
      //   label: 'Solve X',
      //   path: 'solve-x',
      //   problemGenerateFn: 'problemGenerateFnSolveXProblem',
      //   teachingVideoId: 'Qa-MCLDrSlI',
      //   exampleVideoId: '',
      // },
      // factor: {
      //   label: 'Factor',
      //   path: 'factor',
      //   problemGenerateFn: 'problemGenerateFnFactorProblem',
      //   teachingVideoId: '-y0-vf0zsMg',
      //   exampleVideoId: '',
      // },
      // distribute: {
      //   label: 'Distribute',
      //   path: 'distribute',
      //   problemGenerateFn: 'problemGenerateFnDistributeProblem',
      //   teachingVideoId: 'CTw40jSAUx0',
      //   exampleVideoId: '',
      // },
      // exponent: {
      //   label: 'Exponent',
      //   path: 'exponent',
      //   problemGenerateFn: 'problemGenerateFnExponentProblem',
      //   teachingVideoId: 'NS4vHqJIPiE',
      //   exampleVideoId: '',
      // },
      // exponent2: {
      //   label: 'Exponent 2',
      //   path: 'exponent-2',
      //   problemGenerateFn: 'problemGenerateFnExponent2Problem',
      //   teachingVideoId: 'CTw40jSAUx0',
      //   exampleVideoId: 'MP3viJTn-e4',
      // },
      // solveratiotable: {
      //   label: 'Solve Ratio Table',
      //   path: 'solve-ratio-table',
      //   problemGenerateFn: 'problemGenerateFnSolveRatioTableProblem',
      //   teachingVideoId: '6uwnkOC5hLI',
      //   exampleVideoId: '',
      // },
      // addsubtractmixed: {
      //   label: 'Add Subtract Mixed',
      //   path: 'add-subtract-mixed',
      //   problemGenerateFn: 'problemGenerateFnAddSubtractMixedProblem',
      //   teachingVideoId: 'h7Vs7uUPZrE', // Updated video ID
      //   exampleVideoId: '',
      // },
      // dividemixednumbers: {
      //   label: 'Divide Mixed Numbers',
      //   path: 'divide-mixed-numbers',
      //   problemGenerateFn: 'problemGenerateFnDivideMixedNumbersProblem',
      //   teachingVideoId: 'cARsEw-s8Fg',
      //   exampleVideoId: '',
      // },
      // 'mixed-to-improper': {
      //   label: 'Mixed to Improper',
      //   path: 'mixed-to-improper',
      //   problemGenerateFn: 'problemGenerateFnMixedToImproperProblem',
      //   teachingVideoId: '96NOYcnmThU',
      //   exampleVideoId: '',
      // },
      // 'improper-to-mixed': {
      //   label: 'Improper to Mixed',
      //   path: 'improper-to-mixed',
      //   problemGenerateFn: 'problemGenerateFnImproperToMixedProblem',
      //   teachingVideoId: 'EpXCr2iax5E',
      //   exampleVideoId: '',
      // },
      lcm: {
        label: 'LCM',
        path: 'lcm',
        problemGenerateFn: 'RationalNumbers.generateLCMProblem',
        teachingVideoId: '53Ed5yjBELc',
        exampleVideoId: '',
      },
      gcf: {
        label: 'GCF',
        path: 'gcf',
        problemGenerateFn: 'RationalNumbers.generateGCFProblem',
        teachingVideoId: 'crWLFqOQtBA',
        exampleVideoId: '',
      },
      opposites: {
        label: 'Opposites',
        path: 'opposites',
        problemGenerateFn: 'RationalNumbers.generateOppositesProblem',
        teachingVideoId: 'GJTI6y0ZKWE',
        exampleVideoId: '',
      },
      absolutevalue: {
        label: 'Absolute Value',
        path: 'absolute-value',
        problemGenerateFn: 'RationalNumbers.generateAbsoluteValueProblem',
        teachingVideoId: 'NNsdEV0jJqM',
        exampleVideoId: '',
      },
    },
  },
  Data: {
    label: 'Data',
    path: 'data',
    operations: {
      mean: {
        label: 'Mean',
        path: 'mean',
        problemGenerateFn: 'Data.generateMeanProblem',
        teachingVideoId: 'H7u0Zrra060',
        exampleVideoId: '',
      },
      median: {
        label: 'Median',
        path: 'median',
        problemGenerateFn: 'Data.generateMedianProblem',
        teachingVideoId: 'Y7M_KNwIZvw',
        exampleVideoId: '',
      },
      mode: {
        label: 'Mode',
        path: 'mode',
        problemGenerateFn: 'Data.generateModeProblem',
        teachingVideoId: 'dyQ-leIVuRI',
        exampleVideoId: '',
      },
      range: {
        label: 'Range',
        path: 'range',
        problemGenerateFn: 'Data.generateRangeProblem',
        teachingVideoId: '0HS1P3vhNBU',
        exampleVideoId: '',
      },
      firstquartile: {
        label: 'First Quartile',
        path: 'first-quartile',
        problemGenerateFn: 'Data.generateFirstQuartileProblem',
        teachingVideoId: 'oPw2OpIZ4DY',
        exampleVideoId: '',
      },
      thirdquartile: {
        label: 'Third Quartile',
        path: 'third-quartile',
        problemGenerateFn: 'Data.generateThirdQuartileProblem',
        teachingVideoId: 'oPw2OpIZ4DY',
        exampleVideoId: '',
      },
      interquartilerange: {
        label: 'Interquartile Range',
        path: 'interquartile-range',
        problemGenerateFn: 'Data.generateInterquartileRangeProblem',
        teachingVideoId: 'VABsJBw1JqA',
        exampleVideoId: '',
      },
      writeequation: {
        label: 'Write Equation',
        path: 'write-equation',
        problemGenerateFn: 'Data.generateWriteEquationProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
      solveratiotable: {
        label: 'Solve Ratio Table',
        path: 'solve-ratio-table',
        problemGenerateFn: 'Data.generateSolveRatioTableProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
      dividemixednumbers: {
        label: 'Divide Mixed Numbers',
        path: 'divide-mixed-numbers',
        problemGenerateFn: 'Data.generateDivideMixedNumbersProblem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
      exponent2problem: {
        label: 'Exponent 2',
        path: 'exponent-2',
        problemGenerateFn: 'Data.generateExponent2Problem',
        teachingVideoId: '8GXzCVIvMH0',
        exampleVideoId: '',
      },
    },
  },
};
