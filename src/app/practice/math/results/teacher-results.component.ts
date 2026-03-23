import { Component, inject, signal, OnInit } from '@angular/core';
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
  standalone: true,
  templateUrl: './teacher-results.component.html',
  styleUrl: './teacher-results.component.scss',
})
export default class TeacherResultsComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  readonly loading = signal(true);
  readonly students = signal<StudentSummary[]>([]);
  readonly selectedStudent = signal<StudentSummary | null>(null);
  readonly selectedAttempts = signal<AttemptDetail[]>([]);
  readonly detailLoading = signal(false);

  async ngOnInit(): Promise<void> {
    const profile = this.auth.userProfile();
    if (!profile || profile.role !== 'TEACHER') return;

    try {
      // Get teacher's classrooms
      const { data: classrooms } = await this.data.models.Classroom
        .listClassroomByTeacherId({ teacherId: profile.id });

      if (!classrooms?.length) {
        this.loading.set(false);
        return;
      }

      // Get enrollments for all classrooms
      const studentIds = new Set<string>();
      const studentNames = new Map<string, string>();

      for (const classroom of classrooms) {
        const { data: enrollments } = await this.data.models.ClassroomEnrollment
          .listClassroomEnrollmentByClassroomId({ classroomId: classroom.id });

        if (enrollments) {
          for (const enrollment of enrollments) {
            if (enrollment.isActive) {
              studentIds.add(enrollment.studentId);
            }
          }
        }
      }

      // Get student names and performance counters
      const summaries: StudentSummary[] = [];

      for (const studentId of studentIds) {
        const { data: counters } = await this.data.models.PerformanceCounter
          .listPerformanceCounterByStudentId({ studentId });

        // Try to get student display name from UserProfile
        let displayName = studentId;
        try {
          const { data: studentProfile } = await this.data.models.UserProfile.get({ id: studentId });
          if (studentProfile) {
            displayName = studentProfile.displayName;
            studentNames.set(studentId, displayName);
          }
        } catch {
          // Fallback to ID if profile not accessible
        }

        const totalCorrect = counters?.reduce((sum, c) => sum + (c.correct ?? 0), 0) ?? 0;
        const totalIncorrect = counters?.reduce((sum, c) => sum + (c.incorrect ?? 0), 0) ?? 0;
        const total = totalCorrect + totalIncorrect;
        const bestStreak = counters?.reduce((max, c) => Math.max(max, c.highStreak ?? 0), 0) ?? 0;
        const lastActive = counters?.reduce((latest, c) => {
          const t = c.lastAttemptedAt ?? '';
          return t > latest ? t : latest;
        }, '') ?? '';

        summaries.push({
          studentId,
          displayName,
          totalCorrect,
          totalIncorrect,
          accuracy: total === 0 ? 0 : Math.round((totalCorrect / total) * 100),
          bestStreak,
          lastActive,
        });
      }

      // Sort by last active (most recent first)
      summaries.sort((a, b) => b.lastActive.localeCompare(a.lastActive));
      this.students.set(summaries);
    } finally {
      this.loading.set(false);
    }
  }

  async selectStudent(student: StudentSummary): Promise<void> {
    this.selectedStudent.set(student);
    this.detailLoading.set(true);

    try {
      const { data } = await this.data.models.ProblemAttempt
        .listProblemAttemptByStudentIdAndAttemptedAt(
          { studentId: student.studentId },
          { sortDirection: 'DESC', limit: 20 },
        );

      if (data) {
        this.selectedAttempts.set(data.map(a => ({
          id: a.id,
          problemType: a.problemType,
          question: a.question,
          studentAnswer: a.studentAnswer,
          correctAnswer: a.correctAnswer,
          isCorrect: a.isCorrect,
          attemptedAt: a.attemptedAt ?? '',
        })));
      }
    } catch {
      this.selectedAttempts.set([]);
    } finally {
      this.detailLoading.set(false);
    }
  }

  clearSelection(): void {
    this.selectedStudent.set(null);
    this.selectedAttempts.set([]);
  }

  formatType(type: string): string {
    return getTaxonomy(type).displayLabel;
  }

  formatDate(iso: string): string {
    if (!iso) return 'Never';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
}
