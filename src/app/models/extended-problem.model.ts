import { Problem, ValidateFn } from './problem.model';

interface OperationLookup {
  problemGenerateFn: string;
  teachingVideoId: string;
  exampleVideoId: string;
}

const operationLookup: { [key: string]: OperationLookup} = {
  addition: {
    problemGenerateFn: 'problemGenerateFnAdditionProblem',
    teachingVideoId: 'WwKLA-6S-e0',
    exampleVideoId: '1xXibPhF3bw',
  },
  subtraction: {
    problemGenerateFn: 'problemGenerateFnSubtractionProblem',
    teachingVideoId: 'a8tCGNB-vOk',
    exampleVideoId: 'w6LfGwslhlw',
  },
  translation: {
    problemGenerateFn: 'problemGenerateFnTranslationProblem',
    teachingVideoId: 'w6LfGwslhlw',
    exampleVideoId: 'w6LfGwslhlw',
  },
  simplify: {
    problemGenerateFn: 'problemGenerateFnSimplifyProblem',
    teachingVideoId: '4CKDqvddhhg',
    exampleVideoId: '',
  },
  wholetimesmixed: {
    problemGenerateFn: 'problemGenerateFnWholeTimesMixedProblem',
    teachingVideoId: '4JV6fPXZPXA',
    exampleVideoId: '',
  },
  dividefractions: {
    problemGenerateFn: 'problemGenerateFnDivideFractionsProblem',
    teachingVideoId: '1YWyTdtofdE',
    exampleVideoId: 'cARsEw-s8Fg',
  },
  mean: {
    problemGenerateFn: 'problemGenerateFnMeanProblem',
    teachingVideoId: 'H7u0Zrra060',
    exampleVideoId: '',
  },
  median: {
    problemGenerateFn: 'problemGenerateFnMedianProblem',
    teachingVideoId: 'Y7M_KNwIZvw',
    exampleVideoId: '',
  },
  mode: {
    problemGenerateFn: 'problemGenerateFnModeProblem',
    teachingVideoId: 'dyQ-leIVuRI',
    exampleVideoId: '',
  },
  range: {
    problemGenerateFn: 'problemGenerateFnRangeProblem',
    teachingVideoId: '0HS1P3vhNBU',
    exampleVideoId: '',
  },
  firstquartile: {
    problemGenerateFn: 'problemGenerateFnFirstQuartileProblem',
    teachingVideoId: 'oPw2OpIZ4DY',
    exampleVideoId: '',
  },
  thirdquartile: {
    problemGenerateFn: 'problemGenerateFnThirdQuartileProblem',
    teachingVideoId: 'oPw2OpIZ4DY',
    exampleVideoId: '',
  },
  interquartilerange: {
    problemGenerateFn: 'problemGenerateFnInterquartileRangeProblem',
    teachingVideoId: 'VABsJBw1JqA',
    exampleVideoId: '',
  },
  comparison: {
    problemGenerateFn: 'problemGenerateFnComparisonQuestion',
    teachingVideoId: 'u_QTuWj107o',
    exampleVideoId: '',
  },
  division: {
    problemGenerateFn: 'problemGenerateFnDivisionProblem',
    teachingVideoId: 'lGEdO4cr_TA',
    exampleVideoId: 'rXjV74suB68',
  },
  solvex: {
    problemGenerateFn: 'problemGenerateFnSolveXProblem',
    teachingVideoId: 'Qa-MCLDrSlI',
    exampleVideoId: '',
  },
  factor: {
    problemGenerateFn: 'problemGenerateFnFactorProblem',
    teachingVideoId: '-y0-vf0zsMg',
    exampleVideoId: '',
  },
  distribute: {
    problemGenerateFn: 'problemGenerateFnDistributeProblem',
    teachingVideoId: 'CTw40jSAUx0',
    exampleVideoId: '',
  },
  rounding: {
    problemGenerateFn: 'problemGenerateFnRoundingProblem',
    teachingVideoId: 'KqBJBMEqrZc',
    exampleVideoId: '',
  },
  exponent: {
    problemGenerateFn: 'problemGenerateFnExponentProblem',
    teachingVideoId: 'NS4vHqJIPiE',
    exampleVideoId: '',
  },
  exponent2: {
    problemGenerateFn: 'problemGenerateFnExponent2Problem',
    teachingVideoId: 'CTw40jSAUx0',
    exampleVideoId: 'MP3viJTn-e4',
  },
  lcm: {
    problemGenerateFn: 'problemGenerateFnLCMProblem',
    teachingVideoId: '53Ed5yjBELc',
    exampleVideoId: '',
  },
  gcf: {
    problemGenerateFn: 'problemGenerateFnGCFProblem',
    teachingVideoId: 'crWLFqOQtBA',
    exampleVideoId: '',
  },
  opposites: {
    problemGenerateFn: 'problemGenerateFnOppositesProblem',
    teachingVideoId: 'GJTI6y0ZKWE',
    exampleVideoId: '',
  },
  absolutevalue: {
    problemGenerateFn: 'problemGenerateFnAbsoluteValueProblem',
    teachingVideoId: 'NNsdEV0jJqM',
    exampleVideoId: '',
  },
  solveratiotable: {
    problemGenerateFn: 'problemGenerateFnSolveRatioTableProblem',
    teachingVideoId: '6uwnkOC5hLI',
    exampleVideoId: '',
  },
  addsubtractmixed: {
    problemGenerateFn: 'problemGenerateFnAddSubtractMixedProblem',
    teachingVideoId: 'h7Vs7uUPZrE', // Updated video ID
    exampleVideoId: '',
  },
  dividemixednumbers: {
    problemGenerateFn: 'problemGenerateFnDivideMixedNumbersProblem',
    teachingVideoId: 'cARsEw-s8Fg',
    exampleVideoId: '',
  },
  percentDecimal: {
    problemGenerateFn: 'problemGenerateFnPercentDecimalQuestion',
    teachingVideoId: 'jPmno8_2zi0',
    exampleVideoId: '',
  },
  percentofnumber: {
    problemGenerateFn: 'problemGenerateFnPercentOfNumberProblem',
    teachingVideoId: 'AL0-0f9azNo',
    exampleVideoId: '',
  },
  'mixed-to-improper': {
    problemGenerateFn: 'problemGenerateFnMixedToImproperProblem',
    teachingVideoId: '96NOYcnmThU',
    exampleVideoId: '',
  },
  'improper-to-mixed': {
    problemGenerateFn: 'problemGenerateFnImproperToMixedProblem',
    teachingVideoId: 'EpXCr2iax5E',
    exampleVideoId: '',
  },
  convert: {
    problemGenerateFn: 'problemGenerateFnConvertQuestion',
    teachingVideoId: 'guBVW5PiHLs',
    exampleVideoId: '',
  },
  unknown: {
    problemGenerateFn: 'problemGenerateFnUnknownProblem',
    teachingVideoId: '',
    exampleVideoId: '',
  },
  solveforx: {
    problemGenerateFn: 'problemGenerateFnSolveForXProblem',
    teachingVideoId: 'Qa-MCLDrSlI',
    exampleVideoId: '',
  },
  writeequation: {
    problemGenerateFn: 'problemGenerateFnWriteEquationProblem',
    teachingVideoId: 'o_Ubm7OI8t4',
    exampleVideoId: '',
  },
  multiplication: {
    problemGenerateFn: 'problemGenerateFnMultiplicationProblem',
    teachingVideoId: 'PZjIT9CH6bM',
    exampleVideoId: 'hV3RstrYGEA',
  },
};

export class ExtendedProblem extends Problem {
  videoIds: {
    teaching: string;
    example: string;
  };
  constructor(
    question: string,
    answer: string,
    validateFn: ValidateFn,
    hint: string,
    public operation: string
  ) {
    super(question, answer, validateFn, hint);
    this.operation = operation;
    this.videoIds = {
      teaching: operationLookup[operation].teachingVideoId,
      example: operationLookup[operation].exampleVideoId,
    };
  }
  static operationLookup(operation: string): OperationLookup {
    return operationLookup[operation];
  }
}

