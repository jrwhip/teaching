import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { DataService } from '../../../core/data/data.service';

export interface AttemptParams {
  problemType: string;
  problemCategory: string;
  question: string;
  correctAnswer: string;
  studentAnswer: string;
  isCorrect: boolean;
  hint?: string;
  attemptDurationMs?: number;
}

interface LocalAttempt extends AttemptParams {
  sessionId: string;
  attemptedAt: string;
}

export interface PerformanceCounterRecord {
  id: string;
  studentId: string;
  problemType: string;
  correct: number;
  incorrect: number;
  currentStreak: number;
  highStreak: number;
  lastAttemptedAt: string;
}

export interface RecentAttemptRecord {
  id: string;
  problemType: string;
  problemCategory: string;
  question: string;
  correctAnswer: string;
  studentAnswer: string;
  isCorrect: boolean;
  attemptedAt: string;
}

const LOCAL_KEY = 'mathResultsOffline';

@Injectable({ providedIn: 'root' })
export class MathResultsService {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  readonly sessionId = signal<string>(crypto.randomUUID());
  readonly sessionCorrect = signal(0);
  readonly sessionIncorrect = signal(0);
  readonly sessionAccuracy = computed(() => {
    const total = this.sessionCorrect() + this.sessionIncorrect();
    return total === 0 ? 0 : Math.round((this.sessionCorrect() / total) * 100);
  });

  // Loaded stats
  readonly performanceCounters = signal<PerformanceCounterRecord[]>([]);
  readonly recentAttempts = signal<RecentAttemptRecord[]>([]);
  readonly statsLoading = signal(false);

  readonly totalCorrect = computed(() =>
    this.performanceCounters().reduce((sum, c) => sum + c.correct, 0)
  );
  readonly totalIncorrect = computed(() =>
    this.performanceCounters().reduce((sum, c) => sum + c.incorrect, 0)
  );
  readonly totalAccuracy = computed(() => {
    const total = this.totalCorrect() + this.totalIncorrect();
    return total === 0 ? 0 : Math.round((this.totalCorrect() / total) * 100);
  });
  readonly bestStreak = computed(() =>
    this.performanceCounters().reduce((max, c) => Math.max(max, c.highStreak), 0)
  );

  startNewSession(): void {
    this.sessionId.set(crypto.randomUUID());
    this.sessionCorrect.set(0);
    this.sessionIncorrect.set(0);
  }

  async recordAttempt(params: AttemptParams): Promise<void> {
    if (params.isCorrect) {
      this.sessionCorrect.update(c => c + 1);
    } else {
      this.sessionIncorrect.update(c => c + 1);
    }

    const profile = this.auth.userProfile();
    if (!profile) {
      this.storeLocally(params);
      return;
    }

    const attemptedAt = new Date().toISOString();

    try {
      await this.data.models.ProblemAttempt.create({
        studentId: profile.id,
        problemType: params.problemType,
        problemCategory: params.problemCategory,
        question: params.question,
        correctAnswer: params.correctAnswer,
        studentAnswer: params.studentAnswer,
        isCorrect: params.isCorrect,
        hint: params.hint ?? null,
        sessionId: this.sessionId(),
        attemptDurationMs: params.attemptDurationMs ?? null,
        readAccess: profile.readAccess,
        attemptedAt,
      });

      await this.upsertPerformanceCounter(profile.id, params, profile.readAccess);
    } catch {
      // DynamoDB write failed — fall back to localStorage
      this.storeLocally(params);
    }
  }

  async loadStudentStats(studentId?: string): Promise<void> {
    const profile = this.auth.userProfile();
    const id = studentId ?? profile?.id;
    if (!id) return;

    this.statsLoading.set(true);
    try {
      await Promise.all([
        this.loadPerformanceCounters(id),
        this.loadRecentAttempts(id),
      ]);
    } finally {
      this.statsLoading.set(false);
    }
  }

  async loadPerformanceCounters(studentId: string): Promise<void> {
    try {
      const { data } = await this.data.models.PerformanceCounter
        .listPerformanceCounterByStudentId({ studentId });
      if (data) {
        this.performanceCounters.set(data.map(c => ({
          id: c.id,
          studentId: c.studentId,
          problemType: c.problemType,
          correct: c.correct ?? 0,
          incorrect: c.incorrect ?? 0,
          currentStreak: c.currentStreak ?? 0,
          highStreak: c.highStreak ?? 0,
          lastAttemptedAt: c.lastAttemptedAt ?? '',
        })));
      }
    } catch {
      this.performanceCounters.set([]);
    }
  }

  async loadRecentAttempts(studentId: string, limit = 10): Promise<void> {
    try {
      const { data } = await this.data.models.ProblemAttempt
        .listProblemAttemptByStudentIdAndAttemptedAt(
          { studentId },
          { sortDirection: 'DESC', limit },
        );
      if (data) {
        this.recentAttempts.set(data.map(a => ({
          id: a.id,
          problemType: a.problemType,
          problemCategory: a.problemCategory ?? '',
          question: a.question,
          correctAnswer: a.correctAnswer,
          studentAnswer: a.studentAnswer,
          isCorrect: a.isCorrect,
          attemptedAt: a.attemptedAt ?? '',
        })));
      }
    } catch {
      this.recentAttempts.set([]);
    }
  }

  private async upsertPerformanceCounter(
    studentId: string,
    params: AttemptParams,
    readAccess: string[],
  ): Promise<void> {
    try {
      const { data: counters } = await this.data.models.PerformanceCounter
        .listPerformanceCounterByStudentId({ studentId });

      const existing = counters?.find(c => c.problemType === params.problemType);

      if (existing) {
        const correct = (existing.correct ?? 0) + (params.isCorrect ? 1 : 0);
        const incorrect = (existing.incorrect ?? 0) + (params.isCorrect ? 0 : 1);
        const currentStreak = params.isCorrect ? (existing.currentStreak ?? 0) + 1 : 0;
        const highStreak = Math.max(existing.highStreak ?? 0, currentStreak);

        await this.data.models.PerformanceCounter.update({
          id: existing.id,
          correct,
          incorrect,
          currentStreak,
          highStreak,
          lastAttemptedAt: new Date().toISOString(),
        });
      } else {
        await this.data.models.PerformanceCounter.create({
          studentId,
          problemType: params.problemType,
          correct: params.isCorrect ? 1 : 0,
          incorrect: params.isCorrect ? 0 : 1,
          currentStreak: params.isCorrect ? 1 : 0,
          highStreak: params.isCorrect ? 1 : 0,
          readAccess,
          lastAttemptedAt: new Date().toISOString(),
        });
      }
    } catch {
      // Counter upsert is best-effort; the ProblemAttempt is the source of truth
    }
  }

  private storeLocally(params: AttemptParams): void {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      const entries: LocalAttempt[] = raw ? JSON.parse(raw) : [];
      entries.push({
        ...params,
        sessionId: this.sessionId(),
        attemptedAt: new Date().toISOString(),
      });
      // Cap at 500 entries to avoid blowing up localStorage
      if (entries.length > 500) entries.splice(0, entries.length - 500);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(entries));
    } catch {
      // localStorage full or unavailable — drop silently
    }
  }
}
