export type UserRole = 'TEACHER' | 'PARENT' | 'STUDENT';

export interface UserProfile {
  id: string;
  cognitoSub: string;
  email: string;
  displayName: string;
  role: UserRole;
  readAccess: string[];
  createdAt?: string;
}
