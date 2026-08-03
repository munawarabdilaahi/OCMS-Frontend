# Changelog

All notable OCMS frontend changes will be documented in this file.

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
