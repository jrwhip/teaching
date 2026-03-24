import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, defer, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import type { UserRole } from '../auth/auth.types';
import { DataService } from './data.service';
import { ClassroomService } from './classroom.service';
import { EnrollmentRecord, ParentLinkRecord, StudentSummary } from './data.types';

interface CreateStudentParams {
  email: string;
  displayName: string;
  password: string;
  classroomId?: string;
  parentId?: string;
}

@Injectable({ providedIn: 'root' })
export class StudentManagementService {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly classroomService = inject(ClassroomService);

  private readonly trigger = signal(0);

  // --- Teacher view: students across teacher's classrooms ---

  private readonly teacherStudentsResource = rxResource({
    params: () => ({
      classrooms: this.classroomService.classrooms(),
      role: this.auth.userRole(),
      tick: this.trigger(),
    }),
    stream: ({ params: { classrooms, role } }) => {
      if (role !== 'TEACHER' || classrooms.length === 0) return of([] as StudentSummary[]);

      const enrollmentQueries$ = classrooms.map(c =>
        defer(() =>
          this.data.models.ClassroomEnrollment
            .listClassroomEnrollmentByClassroomId({ classroomId: c.id }),
        ).pipe(
          map(({ data }) =>
            (data ?? []).map(e => ({
              id: e.id,
              classroomId: e.classroomId,
              studentId: e.studentId,
              enrolledBy: e.enrolledBy ?? '',
              isActive: e.isActive ?? true,
              enrolledAt: e.enrolledAt ?? '',
            } satisfies EnrollmentRecord)),
          ),
          catchError(() => of([] as EnrollmentRecord[])),
        ),
      );

      return forkJoin(enrollmentQueries$).pipe(
        map(results => results.flat()),
        switchMap(enrollments => {
          const uniqueStudentIds = [...new Set(enrollments.map(e => e.studentId))];
          if (uniqueStudentIds.length === 0) return of([] as StudentSummary[]);

          const profileQueries$ = uniqueStudentIds.map(id =>
            defer(() => this.data.models.UserProfile.get({ id })).pipe(
              map(({ data: p }) => {
                if (!p) return null;
                return {
                  id: p.id,
                  displayName: p.displayName,
                  email: p.email,
                  role: (p.role ?? 'STUDENT') as UserRole,
                } satisfies StudentSummary;
              }),
              catchError(() => of(null)),
            ),
          );

          return forkJoin(profileQueries$).pipe(
            map(profiles => profiles.filter((p): p is StudentSummary => p !== null)),
          );
        }),
        catchError(() => of([] as StudentSummary[])),
      );
    },
    defaultValue: [] as StudentSummary[],
  });

  // --- Parent view: linked students ---

  private readonly parentStudentsResource = rxResource({
    params: () => ({
      parentId: this.auth.userProfile()?.id,
      role: this.auth.userRole(),
      tick: this.trigger(),
    }),
    stream: ({ params: { parentId, role } }) => {
      if (role !== 'PARENT' || !parentId) return of([] as StudentSummary[]);

      return defer(() =>
        this.data.models.ParentStudentLink
          .listParentStudentLinkByParentId({ parentId }),
      ).pipe(
        switchMap(({ data: links }) => {
          const studentIds = (links ?? []).map(l => l.studentId);
          if (studentIds.length === 0) return of([] as StudentSummary[]);

          const profileQueries$ = studentIds.map(id =>
            defer(() => this.data.models.UserProfile.get({ id })).pipe(
              map(({ data: p }) => {
                if (!p) return null;
                return {
                  id: p.id,
                  displayName: p.displayName,
                  email: p.email,
                  role: (p.role ?? 'STUDENT') as UserRole,
                } satisfies StudentSummary;
              }),
              catchError(() => of(null)),
            ),
          );

          return forkJoin(profileQueries$).pipe(
            map(profiles => profiles.filter((p): p is StudentSummary => p !== null)),
          );
        }),
        catchError(() => of([] as StudentSummary[])),
      );
    },
    defaultValue: [] as StudentSummary[],
  });

  // --- Public read signals ---

  readonly students = computed((): StudentSummary[] => {
    const role = this.auth.userRole();
    if (role === 'TEACHER') return this.teacherStudentsResource.value();
    if (role === 'PARENT') return this.parentStudentsResource.value();
    return [];
  });

  readonly studentsLoading = computed(() =>
    this.teacherStudentsResource.isLoading() || this.parentStudentsResource.isLoading(),
  );

  readonly studentCount = computed(() => this.students().length);

  // --- Parent links (for parent view) ---

  private readonly parentLinksResource = rxResource({
    params: () => ({
      parentId: this.auth.userProfile()?.id,
      role: this.auth.userRole(),
      tick: this.trigger(),
    }),
    stream: ({ params: { parentId, role } }) => {
      if (role !== 'PARENT' || !parentId) return of([]);
      return defer(() =>
        this.data.models.ParentStudentLink
          .listParentStudentLinkByParentId({ parentId }),
      ).pipe(
        map(({ data }) =>
          (data ?? []).map(l => ({
            id: l.id,
            parentId: l.parentId,
            studentId: l.studentId,
            relationship: l.relationship ?? '',
            createdAt: l.createdAt ?? '',
          } satisfies ParentLinkRecord)),
        ),
        catchError(() => of([])),
      );
    },
    defaultValue: [] as ParentLinkRecord[],
  });

  readonly parentLinks = this.parentLinksResource.value;

  // --- Enrollments (for classroom detail) ---

  getEnrollmentsByClassroomId(classroomId: string): Observable<EnrollmentRecord[]> {
    return defer(() =>
      this.data.models.ClassroomEnrollment
        .listClassroomEnrollmentByClassroomId({ classroomId }),
    ).pipe(
      map(({ data }) =>
        (data ?? []).map(e => ({
          id: e.id,
          classroomId: e.classroomId,
          studentId: e.studentId,
          enrolledBy: e.enrolledBy ?? '',
          isActive: e.isActive ?? true,
          enrolledAt: e.enrolledAt ?? '',
        } satisfies EnrollmentRecord)),
      ),
      catchError(() => of([])),
    );
  }

  getStudentProfile(studentId: string): Observable<StudentSummary | null> {
    return defer(() => this.data.models.UserProfile.get({ id: studentId })).pipe(
      map(({ data: p }) => {
        if (!p) return null;
        return {
          id: p.id,
          displayName: p.displayName,
          email: p.email,
          role: (p.role ?? 'STUDENT') as UserRole,
        } satisfies StudentSummary;
      }),
      catchError(() => of(null)),
    );
  }

  // --- Mutations ---

  createStudent(params: CreateStudentParams): Observable<StudentSummary> {
    return defer(() =>
      this.data.mutations.createStudent({
        email: params.email,
        displayName: params.displayName,
        password: params.password,
        classroomId: params.classroomId,
        parentId: params.parentId,
      }),
    ).pipe(
      map(({ data }) => {
        if (!data) throw new Error('Failed to create student');
        return {
          id: data.id,
          displayName: data.displayName,
          email: data.email,
          role: (data.role ?? 'STUDENT') as UserRole,
        } satisfies StudentSummary;
      }),
    );
  }

  joinClassroom(inviteCode: string, studentId: string): Observable<EnrollmentRecord> {
    return defer(() =>
      this.data.mutations.joinClassroom({ inviteCode, studentId }),
    ).pipe(
      map(({ data }) => {
        if (!data) throw new Error('Failed to join classroom');
        return {
          id: data.id,
          classroomId: data.classroomId,
          studentId: data.studentId,
          enrolledBy: data.enrolledBy ?? '',
          isActive: data.isActive ?? true,
          enrolledAt: data.enrolledAt ?? '',
        } satisfies EnrollmentRecord;
      }),
    );
  }

  linkStudent(studentId: string, relationship?: string): Observable<ParentLinkRecord> {
    return defer(() =>
      this.data.mutations.linkStudent({ studentId, relationship }),
    ).pipe(
      map(({ data }) => {
        if (!data) throw new Error('Failed to link student');
        return {
          id: data.id,
          parentId: data.parentId,
          studentId: data.studentId,
          relationship: data.relationship ?? '',
          createdAt: data.createdAt ?? '',
        } satisfies ParentLinkRecord;
      }),
    );
  }

  reload(): void {
    this.trigger.update(v => v + 1);
  }
}
