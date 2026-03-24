import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, defer, map, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataService } from './data.service';

export interface AssignmentRecord {
  id: string;
  studentId: string;
  title: string;
  problemCategory: string;
  isActive: boolean;
  dueDate: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class StudentAssignmentService {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  private readonly assignmentsResource = rxResource({
    params: () => this.auth.userProfile()?.id,
    stream: ({ params: studentId }) => {
      if (!studentId) return of([]);
      return defer(() =>
        this.data.models.Assignment.listAssignmentByStudentId({ studentId }),
      ).pipe(
        map(({ data }) =>
          (data ?? [])
            .filter(a => a.isActive)
            .map(a => ({
              id: a.id,
              studentId: a.studentId,
              title: a.title ?? '',
              problemCategory: a.problemCategory,
              isActive: a.isActive ?? true,
              dueDate: a.dueDate ?? '',
              createdAt: a.createdAt ?? '',
            } satisfies AssignmentRecord)),
        ),
        catchError(() => of([])),
      );
    },
    defaultValue: [] as AssignmentRecord[],
  });

  readonly activeAssignments = this.assignmentsResource.value;
  readonly activeCount = computed(() => this.activeAssignments().length);
}
