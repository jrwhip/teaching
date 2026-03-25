import { PerformanceCounterRecord } from './math-results.service';

export interface WeaknessWeight {
  problemType: string;
  weight: number;
  accuracy: number;
  totalAttempts: number;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Compute weighted problem-type selection based on student weakness.
 *
 * Weighting rules:
 *  - Accuracy < 70% → 3× weight
 *  - Never attempted → 2× weight (explore)
 *  - Accuracy ≥ 90% → 0.5× weight
 *  - Not practiced in 7+ days → 1.5× multiplier
 *  - Minimum weight 0.25 (nothing fully excluded)
 */
export function calculateWeights(
  counters: PerformanceCounterRecord[],
  allTypes: string[],
): WeaknessWeight[] {
  const counterMap = new Map(counters.map(c => [c.problemType, c]));
  const now = Date.now();

  return allTypes.map(problemType => {
    const counter = counterMap.get(problemType);

    if (!counter) {
      return { problemType, weight: 2, accuracy: 0, totalAttempts: 0 };
    }

    const total = counter.correct + counter.incorrect;
    const accuracy = total === 0 ? 0 : Math.round((counter.correct / total) * 100);

    let weight: number;
    if (accuracy < 70) {
      weight = 3;
    } else if (accuracy >= 90) {
      weight = 0.5;
    } else {
      weight = 1;
    }

    // Recency multiplier
    if (counter.lastAttemptedAt) {
      const lastAttempted = new Date(counter.lastAttemptedAt).getTime();
      if (now - lastAttempted > SEVEN_DAYS_MS) {
        weight *= 1.5;
      }
    }

    return {
      problemType,
      weight: Math.max(0.25, weight),
      accuracy,
      totalAttempts: total,
    };
  });
}

/** Pick a problem type using weighted random selection. */
export function weightedRandomPick(weights: WeaknessWeight[]): string {
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  let remaining = Math.random() * totalWeight;

  const picked = weights.find(w => {
    remaining -= w.weight;
    return remaining <= 0;
  });

  return (picked ?? weights[weights.length - 1]).problemType;
}
