import { ProblemGenerator, ProblemType } from '../problem.model';
import { getTaxonomy } from '../../shared/problem-taxonomy';
import { BASICS_GENERATORS } from './basics';
import { FRACTIONS_GENERATORS } from './fractions';
import { COMPARE_PERCENT_RATIOS_GENERATORS } from './compare-percent-ratios';
import { EQUATIONS_GENERATORS } from './equations';
import { NUMBERS_STATS_GEOMETRY_GENERATORS } from './numbers-stats-geometry';

/** Wrap each generator to inject difficulty/gradeLevel from the taxonomy. */
function enrichGenerators(
  generators: Record<string, ProblemGenerator>,
): Record<string, ProblemGenerator> {
  return Object.fromEntries(
    Object.entries(generators).map(([key, gen]) => {
      const { difficulty, gradeLevel } = getTaxonomy(key);
      return [key, {
        generate: () => ({ ...gen.generate(), difficulty, gradeLevel }),
      }];
    }),
  );
}

export const GENERATORS = {
  ...enrichGenerators(BASICS_GENERATORS),
  ...enrichGenerators(FRACTIONS_GENERATORS),
  ...enrichGenerators(COMPARE_PERCENT_RATIOS_GENERATORS),
  ...enrichGenerators(EQUATIONS_GENERATORS),
  ...enrichGenerators(NUMBERS_STATS_GEOMETRY_GENERATORS),
} as Record<ProblemType, ProblemGenerator>;
