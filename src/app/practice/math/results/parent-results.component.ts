import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, defer, forkJoin, map, of, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { DataService } from '../../../core/data/data.service';
import { getTaxonomy } from '../shared/problem-taxonomy';

interface StudentSummary {
  studentId: string;
  displayName: string;
  totalCorrect: number;
  totalIncorrect: number;
  accuracy: number;
  bestStreak: number;
  lastActive: string;
}

interface AttemptDetail {
  id: string;
  problemType: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  attemptedAt: string;
}

@Component({
  templateUrl: './parent-results.component.html',
  styleUrl: './parent-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ParentResultsComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  // --- Student roster resource ---

  private readonly studentsResource = rxResource({
    params: () => this.auth.userProfile(),
    stream: ({ params: profile }) => {
      if (!profile || profile.role !== 'PARENT') return of([]);
      return this.loadLinkedStudents(profile.id);
    },
    defaultValue: [] as StudentSummary[],
  });

  readonly loading = this.studentsResource.isLoading;
  readonly students = computed(() => this.studentsResource.value() ?? []);

  // --- Student detail selection ---

  readonly selectedStudent = signal<StudentSummary | null>(null);

  private readonly attemptsResource = rxResource({
    params: () => this.selectedStudent()?.studentId ?? null,
    stream: ({ params: studentId }) => {
      if (!studentId) return of([]);
      return defer(() =>
        this.data.models.ProblemAttempt
          .listProblemAttemptByStudentIdAndAttemptedAt(
            { studentId },
            { sortDirection: 'DESC', limit: 20 },
          ),
      ).pipe(
        map(({ data }) =>
          (data ?? []).map(a => ({
            id: a.id,
            problemType: a.problemType,
            question: a.question,
            studentAnswer: a.studentAnswer,
            correctAnswer: a.correctAnswer,
            isCorrect: a.isCorrect,
            attemptedAt: a.attemptedAt ?? '',
          } satisfies AttemptDetail)),
        ),
        catchError(() => of([])),
      );
    },
    defaultValue: [] as AttemptDetail[],
  });

  readonly selectedAttempts = computed(() => this.attemptsResource.value() ?? []);
  readonly detailLoading = this.attemptsResource.isLoading;

  // --- Actions ---

  selectStudent(student: StudentSummary): void {
    this.selectedStudent.set(student);
  }

  clearSelection(): void {
    this.selectedStudent.set(null);
  }

  formatType(type: string): string {
    return getTaxonomy(type).displayLabel;
  }

  formatDate(iso: string): string {
    if (!iso) return 'Never';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  // --- Private helpers ---

  /**
   * Loads parent-student links -> student summaries.
   * All Amplify calls wrapped in defer() for cold Observable semantics.
   * Parallel fetches via forkJoin.
   */
  private loadLinkedStudents(parentId: string): Observable<StudentSummary[]> {
    return defer(() =>
      this.data.models.ParentStudentLink
        .listParentStudentLinkByParentId({ parentId }),
    ).pipe(
      switchMap(({ data: links }) => {
        if (!links?.length) return of([]);
        return forkJoin(
          links.map(link => this.loadSingleStudentSummary(link.studentId)),
        ).pipe(
          map(summaries =>
            [...summaries].sort((a, b) => b.lastActive.localeCompare(a.lastActive)),
          ),
        );
      }),
      catchError(() => of([])),
    );
  }

  private loadSingleStudentSummary(studentId: string): Observable<StudentSummary> {
    const profile$ = defer(() =>
      this.data.models.UserProfile.get({ id: studentId }),
    ).pipe(
      map(({ data }) => data?.displayName ?? studentId),
      catchError(() => of(studentId)),
    );

    const counters$ = defer(() =>
      this.data.models.PerformanceCounter
        .listPerformanceCounterByStudentId({ studentId }),
    ).pipe(
      map(({ data }) => data ?? []),
      catchError(() => of([])),
    );

    return forkJoin([profile$, counters$]).pipe(
      map(([displayName, counters]) => {
        const totalCorrect = counters.reduce((sum, c) => sum + (c.correct ?? 0), 0);
        const totalIncorrect = counters.reduce((sum, c) => sum + (c.incorrect ?? 0), 0);
        const total = totalCorrect + totalIncorrect;
        const bestStreak = counters.reduce((max, c) => Math.max(max, c.highStreak ?? 0), 0);
        const lastActive = counters.reduce((latest, c) => {
          const t = c.lastAttemptedAt ?? '';
          return t > latest ? t : latest;
        }, '');

        return {
          studentId,
          displayName,
          totalCorrect,
          totalIncorrect,
          accuracy: total === 0 ? 0 : Math.round((totalCorrect / total) * 100),
          bestStreak,
          lastActive,
        } satisfies StudentSummary;
      }),
    );
  }
}
