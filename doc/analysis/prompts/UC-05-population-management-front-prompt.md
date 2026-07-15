# UC-05 - Population Management — Frontend Generation Prompt

## Context

This prompt is used to generate all the frontend code and resources required to implement UC-05 (Population Management) in the ClearReq application. This is a **frontend-only prompt** that assumes the backend API is already fully implemented per the backend generation prompt.

### Stack

- **Frontend**: Angular 21+, Angular Material, standalone components, lazy-loaded feature modules
- **Architecture**: Monorepo — the frontend is served as static assets by the backend on port 8090 (production) or port 4300 (development with hot reload)
- **Styling**: SCSS with shared variables (following the existing pattern in the codebase)
- **i18n**: English and French translation keys via `I18nService` and `TranslatePipe`

### Key Constraints

- Use only modern Angular features (signals, standalone components, no deprecated APIs).
- Protect all population management routes with the `adminGuard`.
- Always display validation errors from the backend gracefully.
- Follow the existing component structure: each component has `.ts`, `.html`, and `.scss` files.
- Reuse existing Material modules and styling patterns.
- Population name must be unique (validate on backend, display error in UI).
- A person can have multiple, separate membership periods in the same population without duplication.

---

## What to Generate

### 1. Feature Module Structure

Lazy-loaded at `/admin/populations` (ADMIN only via `adminGuard`).

```
frontend/
└── src/app/features/populations/
    ├── population-list/
    │   ├── population-list.component.ts
    │   ├── population-list.component.html
    │   └── population-list.component.scss
    ├── population-detail/
    │   ├── population-detail.component.ts
    │   ├── population-detail.component.html
    │   └── population-detail.component.scss
    ├── population-form/
    │   ├── population-form.component.ts
    │   ├── population-form.component.html
    │   └── population-form.component.scss
    ├── member-form/
    │   ├── member-form.component.ts
    │   ├── member-form.component.html
    │   └── member-form.component.scss
    └── population.routes.ts
```

### 2. Service Layer

#### PopulationService

```typescript
// frontend/src/app/features/populations/services/population.service.ts

interface PopulationDto {
  id: string;
  name: string;
  status: 'ACTIVE' | 'CLOSED';
  memberCount: number;
}

interface CreatePopulationRequest {
  name: string;
  status?: 'ACTIVE' | 'CLOSED';
}

interface UpdatePopulationRequest {
  name: string;
  status: 'ACTIVE' | 'CLOSED';
}

interface PopulationMemberDto {
  id: string;
  personId: string;
  personFullName: string;
  functionLabel: string;
  startDate: string; // ISO 8601 format (YYYY-MM-DD)
  endDate: string | null;
}

interface AddPopulationMemberRequest {
  personId: string;
  functionId: string;
  startDate: string; // ISO 8601 format (YYYY-MM-DD)
  endDate?: string; // ISO 8601 format (YYYY-MM-DD), optional
}

interface UpdatePopulationMemberRequest {
  functionId?: string;
  endDate?: string; // ISO 8601 format (YYYY-MM-DD)
}

@Injectable({ providedIn: 'root' })
export class PopulationService {
  // List all populations
  listPopulations(): Observable<PopulationDto[]>

  // Create a new population
  createPopulation(request: CreatePopulationRequest): Observable<PopulationDto>

  // Update an existing population
  updatePopulation(id: string, request: UpdatePopulationRequest): Observable<PopulationDto>

  // Get members of a population
  listMembers(populationId: string): Observable<PopulationMemberDto[]>

  // Add a member to a population
  addMember(populationId: string, request: AddPopulationMemberRequest): Observable<PopulationMemberDto>

  // Update a membership
  updateMember(populationId: string, memberId: string, request: UpdatePopulationMemberRequest): Observable<PopulationMemberDto>
}
```

---

### 3. Components

#### Population List Component

**Purpose**: Display a list of all populations with name, status, and member count.

**Features**:
- List populations in a Material table with columns: `name`, `status`, `memberCount`, `actions`
- "Create population" button at the top
- "Edit" action → navigate to `population-form` component
- "View members" action → navigate to `population-detail` component
- Empty state message when no populations exist
- Error handling with user-friendly messages
- Localized column headers and buttons via `translate` pipe

**Styling**: Follow the existing pattern in `person-list.component.scss` (page header, button styles, table card, action buttons, status badges, empty state).

---

#### Population Form Component (Create / Edit)

**Purpose**: Create a new population or edit an existing one.

**Features**:
- Form fields:
  - `name` (text input, required, must be unique)
  - `status` (select dropdown: ACTIVE / CLOSED, defaults to ACTIVE on create)
- Back button to return to the population list
- Cancel and Save buttons
- Validation:
  - Name is required
  - Display backend validation errors (e.g., duplicate name)
- Reactive forms with proper error messages
- Page title changes based on create vs. edit mode
- Localized labels and error messages via `translate` pipe

**Styling**: Follow the existing pattern in `person-form.component.scss` (page header with back button, form card, form fields, action buttons, error display).

---

#### Population Detail Component

**Purpose**: Display the details of a population (name, status) and its list of members.

**Features**:
- Display population name and status at the top
- Table of members with columns: `personFullName`, `functionLabel`, `startDate`, `endDate`, `actions`
- "Add member" button
- "Edit" action on each member → navigate to `member-form` component (edit mode)
- Empty member list message
- Error handling
- Breadcrumb or back button to return to population list
- Localized content via `translate` pipe

**Styling**: Similar to the population-list, with a header showing population details and a member table below.

---

#### Member Form Component (Add / Edit Membership)

**Purpose**: Add a new member to a population or edit an existing membership.

**Features**:
- Form fields:
  - `personId` (dropdown/select of enabled persons, required)
  - `functionId` (dropdown/select of enabled functions, required)
  - `startDate` (date input, required)
  - `endDate` (date input, optional)
- Back button to return to the population detail
- Cancel and Save buttons
- Validation:
  - All required fields must be filled
  - End date cannot be earlier than start date (validate on form level for immediate feedback)
  - Display backend validation errors (e.g., person is disabled, function is disabled)
- Pre-populate the form when editing an existing membership
- Reactive forms with Angular's date handling (use `MatDatepickerModule`)
- Localized labels and error messages via `translate` pipe

**Styling**: Follow the existing pattern in `person-form.component.scss`.

---

### 4. Routes

Add the population feature routes to the main routes file or create a feature routing module:

```typescript
// frontend/src/app/features/populations/population.routes.ts

{
  path: 'admin/populations',
  canActivate: [adminGuard],
  loadComponent: () => import('./population-list/population-list.component').then(m => m.PopulationListComponent),
  children: [
    {
      path: ':id',
      loadComponent: () => import('./population-detail/population-detail.component').then(m => m.PopulationDetailComponent)
    },
    {
      path: 'new',
      loadComponent: () => import('./population-form/population-form.component').then(m => m.PopulationFormComponent)
    },
    {
      path: ':id/edit',
      loadComponent: () => import('./population-form/population-form.component').then(m => m.PopulationFormComponent)
    },
    {
      path: ':populationId/members/new',
      loadComponent: () => import('./member-form/member-form.component').then(m => m.MemberFormComponent)
    },
    {
      path: ':populationId/members/:memberId/edit',
      loadComponent: () => import('./member-form/member-form.component').then(m => m.MemberFormComponent)
    }
  ]
}
```

**Update `app.routes.ts`**: Add a route entry at the top-level routes to lazy-load the populations feature under `/admin/populations`.

---

### 5. Translation Keys

Add the following translation keys to `en.ts` and `fr.ts`:

```typescript
// Population List
populationList: {
  title: 'Populations',
  newPopulation: 'New population',
  name: 'Name',
  status: 'Status',
  memberCount: 'Members',
  actions: 'Actions',
  edit: 'Edit',
  viewMembers: 'View members',
  noPopulations: 'No populations found.',
  errorLoad: 'Unable to load populations',
  errorCreate: 'Unable to create population',
  errorUpdate: 'Unable to update population',
  statusActive: 'Active',
  statusClosed: 'Closed',
}

// Population Form
populationForm: {
  createPopulation: 'Create population',
  editPopulation: 'Edit population',
  nameRequired: 'Name is required',
  nameDuplicate: 'A population with this name already exists',
  cancel: 'Cancel',
  save: 'Save',
}

// Population Detail / Members
populationMembers: {
  title: 'Members',
  addMember: 'Add member',
  personFullName: 'Full name',
  function: 'Function',
  startDate: 'Start date',
  endDate: 'End date',
  actions: 'Actions',
  edit: 'Edit',
  noMembers: 'No members in this population.',
  errorLoad: 'Unable to load members',
}

// Member Form
memberForm: {
  addMember: 'Add member',
  editMember: 'Edit membership',
  personRequired: 'Person is required',
  functionRequired: 'Function is required',
  startDateRequired: 'Start date is required',
  endDateBeforeStart: 'End date cannot be earlier than start date',
  personDisabled: 'This person is disabled and cannot be added to a population',
  functionDisabled: 'The selected function is no longer enabled',
  cancel: 'Cancel',
  save: 'Save',
}
```

---

### 6. Material Imports

Use the following Material modules (already imported in the codebase):

- `MatButtonModule`: buttons
- `MatIconModule`: icons
- `MatTableModule`: tables
- `MatFormFieldModule`: form fields
- `MatInputModule`: text inputs
- `MatSelectModule`: dropdowns
- `MatDatepickerModule`: date pickers
- `MatNativeDateModule`: native date adapter
- `MatMenuModule`: menus (if needed)
- `MatDividerModule`: dividers (if needed)

---

### 7. Form Validation & Error Handling

- **Reactive Forms**: Use `FormBuilder` and `FormGroup` with proper validators.
- **Backend Errors**: Catch HTTP errors and map them to user-friendly messages via the `translate` pipe.
  - Example: If backend returns a 400 with a message about duplicate name, display `populationForm.nameDuplicate`.
- **Date Validation**: Use `min()` and `max()` validators to ensure end date >= start date.
- **Required Fields**: Mark all required fields with `Validators.required`.

---

### 8. Service Integration

- **PersonService** (existing): Use to fetch the list of enabled persons for the member form dropdown.
- **CatalogService** (existing): Use to fetch the list of enabled functions (type code `FUNCTION`) for the member form dropdown.
- **PopulationService** (new): Implement all CRUD operations for populations and memberships.

---

### 9. Styling Guidelines

- Follow the existing SCSS patterns in the codebase (e.g., `person-list.component.scss`, `person-form.component.scss`).
- Use shared color variables from `styles/variables` (e.g., `$color-brand-deep`, `$color-danger-text`, `$color-success-bg`).
- Use shared typography variables (e.g., `$font-size-2xl`, `$font-weight-bold`).
- Card-based layouts with subtle shadows and borders.
- Status badges with color coding (active = green, closed = gray).
- Responsive table layouts.

---

### 10. Testing (Optional but Recommended)

Create `.spec.ts` files for each component following the existing pattern (e.g., `app.component.spec.ts`).

---

## Expected User Flows

### Create Population

1. ADMIN navigates to `/admin/populations` (Population List).
2. ADMIN clicks "New population".
3. Navigate to `/admin/populations/new` (Population Form).
4. ADMIN enters name and selects status (defaults to ACTIVE).
5. ADMIN clicks "Save".
6. Backend validates and returns success or error (e.g., duplicate name).
7. On success: navigate back to population list and display the new population.
8. On error: display the error message in the form.

### View Population Members

1. ADMIN navigates to `/admin/populations` (Population List).
2. ADMIN clicks "View members" on a population.
3. Navigate to `/admin/populations/{id}` (Population Detail).
4. Display the population name, status, and list of members.

### Add Member to Population

1. ADMIN is on Population Detail page.
2. ADMIN clicks "Add member".
3. Navigate to `/admin/populations/{id}/members/new` (Member Form).
4. ADMIN selects an enabled person, an enabled function, a start date, and optionally an end date.
5. ADMIN clicks "Save".
6. Backend validates and returns success or error (e.g., person is disabled).
7. On success: navigate back to population detail and display the new member in the list.
8. On error: display the error message in the form.

### Edit Population

1. ADMIN navigates to `/admin/populations` (Population List).
2. ADMIN clicks "Edit" on a population.
3. Navigate to `/admin/populations/{id}/edit` (Population Form).
4. Form is pre-populated with current name and status.
5. ADMIN updates the form and clicks "Save".
6. Backend validates and returns success or error.
7. On success: navigate back to population list and display the updated population.
8. On error: display the error message in the form.

### Edit Membership

1. ADMIN is on Population Detail page.
2. ADMIN clicks "Edit" on a member.
3. Navigate to `/admin/populations/{populationId}/members/{memberId}/edit` (Member Form in edit mode).
4. Form is pre-populated with current function, start date, and end date.
5. ADMIN updates the function and/or end date and clicks "Save".
6. Backend validates and returns success or error.
7. On success: navigate back to population detail and display the updated member.
8. On error: display the error message in the form.

---

## Validation Checklist

- [ ] Population list displays all populations with name, status, member count.
- [ ] "Create population" button navigates to the population form.
- [ ] Population form creates and edits populations with name and status.
- [ ] Population name uniqueness is validated and errors are displayed.
- [ ] "View members" or population detail displays the members table.
- [ ] "Add member" button navigates to the member form with a pre-populated person/function dropdown.
- [ ] Member form adds and edits memberships with person, function, start/end dates.
- [ ] Date validation ensures end date >= start date.
- [ ] Backend validation errors are caught and displayed gracefully.
- [ ] All routes are protected with `adminGuard`.
- [ ] All labels and messages are localized in English and French.
- [ ] Styling follows the existing pattern (card-based, Material Design, color variables).
- [ ] No deprecated Angular APIs are used.
- [ ] Standalone components with lazy loading.