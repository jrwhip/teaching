import { ProblemGenerator, ProblemType } from '../problem.model';
import { BASICS_GENERATORS } from './basics';
import { FRACTIONS_GENERATORS } from './fractions';
import { COMPARE_PERCENT_RATIOS_GENERATORS } from './compare-percent-ratios';
import { EQUATIONS_GENERATORS } from './equations';
import { NUMBERS_STATS_GEOMETRY_GENERATORS } from './numbers-stats-geometry';

export const GENERATORS: Record<ProblemType, ProblemGenerator> = {
  ...BASICS_GENERATORS,
  ...FRACTIONS_GENERATORS,
  ...COMPARE_PERCENT_RATIOS_GENERATORS,
  ...EQUATIONS_GENERATORS,
  ...NUMBERS_STATS_GEOMETRY_GENERATORS,
};
