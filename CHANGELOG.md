# Changelog

All notable OCMS frontend changes will be documented in this file.

## [v0.3.0] - 2026-09-01

### Phase 3: Frontend Quality, Consistency & Maintainability

#### Shared Constants (3-K)
- **New:** `lib/status-styles.js` — centralized status badge color maps for all domains (org, student, teacher, course, payment, invoice, attendance, exam, activity).
- **New:** `lib/statuses.js` — shared status enums (ORG_STATUSES, COURSE_STATUSES, INVOICE_STATUSES, ATTENDANCE_STATUSES, EXAM_STATUSES).
- **New:** `lib/genders.js` — shared gender options, replacing hardcoded arrays in student/teacher schemas.
- **New:** `lib/organization-types.js` — university and campus type enums + display labels.
- **Refactor:** Replaced 22+ local `statusStyles` definitions across all list, profile, and detail pages with shared imports via `as statusStyles` aliases.
- **Refactor:** `students-data.js` now re-exports from `lib/genders.js`.
- **Refactor:** `teacher-schema.js` and `TeacherForm.jsx` use shared `GENDERS` instead of hardcoded arrays.
- **Refactor:** `EditTeacher.jsx` uses `teacherStatuses` from `teachers-data.js` instead of inline array.

#### Loading/Error/Empty States (3-H)
- **New:** `components/common/ErrorAlert.jsx` — shared error alert with retry button (RefreshCw icon).
- **New:** `components/common/StatusBadge.jsx` — reusable status badge using centralized styles.
- **Refactor:** All 20 list pages now use `ErrorAlert` with `onRetry` callback instead of plain `Alert`.
- **Refactor:** All 18 list pages now use `TableSkeleton` instead of plain "Loading..." text.
- **Refactor:** RolesList loading state improved with proper skeleton placeholder.

#### 404 Routing (3-G)
- **New:** `features/NotFoundPage.jsx` — proper 404 page with illustration and navigation links.
- **Fix:** `app-shell.jsx` now renders NotFoundPage for unmatched routes instead of infinite PageLoader.

#### Form Standardization (3-A/B)
- **Refactor:** 22+ forms converted from manual useState to React Hook Form + Zod + zodResolver.
- **Refactor:** 10 new Zod schemas created (academic-year, semester, level, program, course, university, department, faculty, campus, exam).
- **Refactor:** RolesList and FeesList dialog forms standardized with RHF+Zod.
- **Refactor:** TeacherForm wired to Zod via zodResolver.
- **Fix:** Auth forms (ForgotPassword, ResetPassword) now use shared FieldError.

#### Pagination/Search Fixes (3-D)
- **Fix:** DepartmentsList double pagination removed (inner DataTable had redundant client-side pagination).
- **Fix:** StudentsDataTable and TeachersDataTable redundant client-side globalFilter removed.

#### Dead Code Cleanup (3-E/F)
- **Remove:** `styles/.gitkeep` (empty), `features/dashboard/dashboard-data.js` (empty, no imports).
- **Clean:** `students-data.js` unused `programs` export removed; `teachers-data.js` unused uppercase constants removed.

### Technical Debt & Notes

- `prisma migrate status` remains blocked (no DATABASE_URL available).
- 9 pre-existing test failures in `security.test.js` are unchanged (test/service logic mismatches, not caused by Phase 1-3 changes).
- Phase 3 is frontend-primary; backend changes limited to Phase 1-2 prior work.

## [v0.2.0] - 2026-08-01

### Changes

- **Students:** `EditStudent.jsx` now passes the status in UPPERCASE so it satisfies the `editStudentSchema.status` enum (previously title-cased `'Active'` made the form unsubmittable).
- **Teachers:** `EditTeacher.jsx` now normalizes the status to the form's Title Case enum (`Active`/`On Leave`/`Contract`/`Inactive`/`Retired`).
- **Academic structure:** `EditAcademicYear`/`EditSemester`/`EditLevel`/`EditProgram` and the four list tables now read the backend's camelCase fields (`startDate`, `endDate`, `academicYear`, `sortOrder`, `durationYears`, `department`, `program`) with snake_case fallbacks.
- **Courses:** `courseStatuses` aligned to the backend `course_status` enum (`ACTIVE`/`INACTIVE`); `CoursesList`/`CourseDetails` status badge styles updated.
- **Exams:** `ExamsList` "View Results" now links with the numeric course id (was passing the `course` object, producing `[object Object]`); course column/CSV/filter now render the course title.
- **Auth:** `AuthContext` maps `studentId`/`teacherId` from the API user's `student`/`teacher` relations.
- **Payments:** `PaymentsList` student filter uses `user.studentId`; `PaymentDetails` payment history reads `created_at`/`payment_method` from `invoice.payments`.
- **Departments:** `departments.service` split into array-returning `getDepartments` and meta-returning `getDepartmentsWithMeta`.

### Technical Debt & Notes

- Dashboard routing for Registrar/Accountant to `AdminDashboard` is now consistent with the backend, which authorizes those roles on `/api/dashboard/admin`.
- Backend now exposes `GET /api/audit-logs` (Admin/SuperAdmin); no frontend audit screen exists yet.

## [v0.1.0] - 2026-07-10

### Changes

- **Docs:** Added frontend AI guidance with `AGENTS.md`, `.ai` rules, domain/product/design context, and frontend documentation scaffold.
- **Docs:** Added Next/React, TanStack Table, forms/dialogs, design system, local development, server-side table, confirmation-dialog, and component-reuse standards.
- **Skills:** Added local frontend skills for Next/React, TanStack Table, and auth/RBAC UI work.

### Technical Debt & Notes

- Existing large feature/table files should be refactored incrementally toward reusable components and server-backed table contracts.
