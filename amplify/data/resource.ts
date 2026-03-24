import {
  type ClientSchema,
  a,
  defineData,
} from '@aws-amplify/backend';
import { createStudentFn } from '../functions/create-student/resource';
import { joinClassroomFn } from '../functions/join-classroom/resource';
import { linkStudentFn } from '../functions/link-student/resource';

const schema = a.schema({
  // ── Enums ──────────────────────────────────────────────────────────────

  UserRole: a.enum(['TEACHER', 'PARENT', 'STUDENT']),

  AssignmentSource: a.enum(['TEACHER', 'PARENT']),

  // ── UserProfile ────────────────────────────────────────────────────────

  UserProfile: a
    .model({
      cognitoSub: a.string().required(),
      email: a.string().required(),
      displayName: a.string().required(),
      role: a.ref('UserRole').required(),
      readAccess: a.string().array().required(),
      createdAt: a.datetime(),

      // Relationships
      ownedClassrooms: a.hasMany('Classroom', 'teacherId'),
      parentLinks: a.hasMany('ParentStudentLink', 'parentId'),
      studentLinks: a.hasMany('ParentStudentLink', 'studentId'),
      enrollments: a.hasMany('ClassroomEnrollment', 'studentId'),
      assignmentsReceived: a.hasMany('Assignment', 'studentId'),
      assignmentsGiven: a.hasMany('Assignment', 'assignedById'),
      problemAttempts: a.hasMany('ProblemAttempt', 'studentId'),
      performanceCounters: a.hasMany('PerformanceCounter', 'studentId'),
    })
    .secondaryIndexes((index) => [
      index('cognitoSub'),
      index('email'),
    ])
    .authorization((allow) => [
      allow.ownersDefinedIn('readAccess'),
      allow.ownerDefinedIn('cognitoSub'),
      allow.group('TEACHER').to(['create']),
      allow.group('PARENT').to(['create']),
    ]),

  // ── Classroom ──────────────────────────────────────────────────────────

  Classroom: a
    .model({
      name: a.string().required(),
      teacherId: a.id().required(),
      inviteCode: a.string().required(),
      isActive: a.boolean().default(true),
      readAccess: a.string().array().required(),
      createdAt: a.datetime(),

      // Relationships
      teacher: a.belongsTo('UserProfile', 'teacherId'),
      enrollments: a.hasMany('ClassroomEnrollment', 'classroomId'),
      assignments: a.hasMany('Assignment', 'classroomId'),
    })
    .secondaryIndexes((index) => [
      index('inviteCode'),
      index('teacherId'),
    ])
    .authorization((allow) => [
      allow.ownersDefinedIn('readAccess'),
      allow.group('TEACHER').to(['create', 'update']),
    ]),

  // ── ClassroomEnrollment ────────────────────────────────────────────────

  ClassroomEnrollment: a
    .model({
      classroomId: a.id().required(),
      studentId: a.id().required(),
      enrolledBy: a.ref('AssignmentSource').required(),
      enrolledById: a.id(),
      isActive: a.boolean().default(true),
      readAccess: a.string().array().required(),
      enrolledAt: a.datetime(),

      // Relationships
      classroom: a.belongsTo('Classroom', 'classroomId'),
      student: a.belongsTo('UserProfile', 'studentId'),
    })
    .secondaryIndexes((index) => [
      index('classroomId'),
      index('studentId'),
    ])
    .authorization((allow) => [
      allow.ownersDefinedIn('readAccess'),
      allow.group('TEACHER').to(['create']),
      allow.group('PARENT').to(['create']),
    ]),

  // ── ParentStudentLink ──────────────────────────────────────────────────

  ParentStudentLink: a
    .model({
      parentId: a.id().required(),
      studentId: a.id().required(),
      relationship: a.string(),
      readAccess: a.string().array().required(),
      createdAt: a.datetime(),

      // Relationships
      parent: a.belongsTo('UserProfile', 'parentId'),
      student: a.belongsTo('UserProfile', 'studentId'),
    })
    .secondaryIndexes((index) => [
      index('parentId'),
      index('studentId'),
    ])
    .authorization((allow) => [
      allow.ownersDefinedIn('readAccess'),
      allow.group('PARENT').to(['create']),
    ]),

  // ── Assignment ─────────────────────────────────────────────────────────

  Assignment: a
    .model({
      studentId: a.id().required(),
      assignedById: a.id().required(),
      source: a.ref('AssignmentSource').required(),
      classroomId: a.id(),
      problemCategory: a.string().required(),
      problemTypes: a.string().array(),
      title: a.string(),
      instructions: a.string(),
      targetCount: a.integer(),
      targetStreak: a.integer(),
      dueDate: a.datetime(),
      isActive: a.boolean().default(true),
      readAccess: a.string().array().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),

      // Relationships
      student: a.belongsTo('UserProfile', 'studentId'),
      assignedBy: a.belongsTo('UserProfile', 'assignedById'),
      classroom: a.belongsTo('Classroom', 'classroomId'),
      problemAttempts: a.hasMany('ProblemAttempt', 'assignmentId'),
    })
    .secondaryIndexes((index) => [
      index('studentId'),
      index('classroomId'),
      index('assignedById'),
    ])
    .authorization((allow) => [
      allow.ownersDefinedIn('readAccess'),
      allow.group('TEACHER').to(['create', 'update']),
      allow.group('PARENT').to(['create', 'update']),
    ]),

  // ── ProblemAttempt ─────────────────────────────────────────────────────

  ProblemAttempt: a
    .model({
      studentId: a.id().required(),
      problemType: a.string().required(),
      problemCategory: a.string().required(),
      question: a.string().required(),
      correctAnswer: a.string().required(),
      studentAnswer: a.string().required(),
      isCorrect: a.boolean().required(),
      hint: a.string(),
      errorType: a.string(),
      difficulty: a.integer(),
      gradeLevel: a.integer(),
      assignmentId: a.id(),
      sessionId: a.string(),
      attemptDurationMs: a.integer(),
      readAccess: a.string().array().required(),
      attemptedAt: a.datetime().required(),

      // Relationships
      student: a.belongsTo('UserProfile', 'studentId'),
      assignment: a.belongsTo('Assignment', 'assignmentId'),
    })
    .secondaryIndexes((index) => [
      index('studentId').sortKeys(['attemptedAt']),
      index('problemType').sortKeys(['attemptedAt']),
      index('assignmentId'),
      index('sessionId'),
    ])
    .authorization((allow) => [
      allow.ownersDefinedIn('readAccess'),
      allow.group('STUDENT').to(['create']),
    ]),

  // ── PerformanceCounter ─────────────────────────────────────────────────

  PerformanceCounter: a
    .model({
      studentId: a.id().required(),
      problemType: a.string().required(),
      correct: a.integer().default(0),
      incorrect: a.integer().default(0),
      currentStreak: a.integer().default(0),
      highStreak: a.integer().default(0),
      readAccess: a.string().array().required(),
      lastAttemptedAt: a.datetime(),

      // Relationships
      student: a.belongsTo('UserProfile', 'studentId'),
    })
    .secondaryIndexes((index) => [
      index('studentId'),
    ])
    .authorization((allow) => [
      allow.ownersDefinedIn('readAccess'),
      allow.group('STUDENT').to(['create', 'update']),
    ]),

  // ── ProblemCategory (Reference Data) ───────────────────────────────────

  ProblemCategory: a
    .model({
      typeId: a.string().required(),
      label: a.string().required(),
      uiCategory: a.string().required(),
      generatorModule: a.string(),
      hasGenerator: a.boolean().default(false),
      teachingVideoId: a.string(),
      exampleVideoId: a.string(),
      sortOrder: a.integer().default(0),
    })
    .secondaryIndexes((index) => [
      index('uiCategory').sortKeys(['sortOrder']),
    ])
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.group('TEACHER').to(['create', 'update']),
    ]),

  // ── Custom Mutations ───────────────────────────────────────────────────

  createStudent: a
    .mutation()
    .arguments({
      email: a.string().required(),
      displayName: a.string().required(),
      password: a.string().required(),
      classroomId: a.id(),
      parentId: a.id(),
    })
    .returns(a.ref('UserProfile'))
    .authorization((allow) => [
      allow.group('TEACHER'),
      allow.group('PARENT'),
    ])
    .handler(a.handler.function(createStudentFn)),

  joinClassroom: a
    .mutation()
    .arguments({
      inviteCode: a.string().required(),
      studentId: a.id().required(),
    })
    .returns(a.ref('ClassroomEnrollment'))
    .authorization((allow) => [
      allow.group('TEACHER'),
      allow.group('PARENT'),
    ])
    .handler(a.handler.function(joinClassroomFn)),

  linkStudent: a
    .mutation()
    .arguments({
      studentId: a.id().required(),
      relationship: a.string(),
    })
    .returns(a.ref('ParentStudentLink'))
    .authorization((allow) => [allow.group('PARENT')])
    .handler(a.handler.function(linkStudentFn)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
