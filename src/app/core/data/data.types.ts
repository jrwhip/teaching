import type { UserRole } from '../auth/auth.types';

export interface ClassroomRecord {
  id: string;
  name: string;
  teacherId: string;
  inviteCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface EnrollmentRecord {
  id: string;
  classroomId: string;
  studentId: string;
  enrolledBy: string;
  isActive: boolean;
  enrolledAt: string;
}

export interface StudentSummary {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
}

export interface ParentLinkRecord {
  id: string;
  parentId: string;
  studentId: string;
  relationship: string;
  createdAt: string;
}
