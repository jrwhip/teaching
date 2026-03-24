import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, defer, map, Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataService } from './data.service';
import { ClassroomRecord } from './data.types';
import { generateInviteCode } from './invite-code.util';

@Injectable({ providedIn: 'root' })
export class ClassroomService {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  private readonly trigger = signal(0);

  private readonly classroomsResource = rxResource({
    params: () => ({ teacherId: this.auth.userProfile()?.id, tick: this.trigger() }),
    stream: ({ params: { teacherId } }) => {
      if (!teacherId) return of([]);
      return defer(() =>
        this.data.models.Classroom.listClassroomByTeacherId({ teacherId }),
      ).pipe(
        map(({ data }) =>
          (data ?? []).map(c => ({
            id: c.id,
            name: c.name,
            teacherId: c.teacherId,
            inviteCode: c.inviteCode,
            isActive: c.isActive ?? true,
            createdAt: c.createdAt ?? '',
          } satisfies ClassroomRecord)),
        ),
        catchError(() => of([])),
      );
    },
    defaultValue: [] as ClassroomRecord[],
  });

  readonly classrooms = this.classroomsResource.value;
  readonly classroomsLoading = this.classroomsResource.isLoading;
  readonly classroomCount = computed(() => this.classrooms().length);

  reload(): void {
    this.trigger.update(v => v + 1);
  }

  create(name: string): Observable<ClassroomRecord> {
    const profile = this.auth.userProfile();
    if (!profile) throw new Error('Not authenticated');

    const inviteCode = generateInviteCode();
    return defer(() =>
      this.data.models.Classroom.create({
        name,
        teacherId: profile.id,
        inviteCode,
        isActive: true,
        readAccess: [profile.cognitoSub],
      }),
    ).pipe(
      map(({ data: c }) => {
        if (!c) throw new Error('Failed to create classroom');
        return {
          id: c.id,
          name: c.name,
          teacherId: c.teacherId,
          inviteCode: c.inviteCode,
          isActive: c.isActive ?? true,
          createdAt: c.createdAt ?? '',
        } satisfies ClassroomRecord;
      }),
    );
  }

  getByInviteCode(code: string): Observable<ClassroomRecord | null> {
    return defer(() =>
      this.data.models.Classroom.listClassroomByInviteCode({ inviteCode: code }),
    ).pipe(
      map(({ data }) => {
        const c = data?.[0];
        if (!c) return null;
        return {
          id: c.id,
          name: c.name,
          teacherId: c.teacherId,
          inviteCode: c.inviteCode,
          isActive: c.isActive ?? true,
          createdAt: c.createdAt ?? '',
        } satisfies ClassroomRecord;
      }),
      catchError(() => of(null)),
    );
  }
}
