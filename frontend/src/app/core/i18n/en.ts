export const en = {
  // ── Global ─────────────────────────────────────────────────────────────────
  loading: 'Loading...',

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    admin: 'Admin',
    users: 'Users',
    persons: 'Persons',
    catalogs: 'Catalogs',
    populations: 'Populations',
    changePassword: 'Change password',
    signOut: 'Sign out',
    language: 'Language',
  },

  // ── Login ───────────────────────────────────────────────────────────────────
  login: {
    title: 'cleareq',
    subtitle: 'Sign in to continue',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign In',
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
    invalidCredentials: 'Invalid username or password.',
  },

  // ── Home ────────────────────────────────────────────────────────────────────
  home: {
    hello: 'Hello,',
    welcomeBack: 'Welcome back to your dashboard',
  },

  // ── Change Password ─────────────────────────────────────────────────────────
  changePassword: {
    title: 'Change Password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    submit: 'Change password',
    success: 'Password changed successfully.',
    error: 'Unable to change password. Check your current password and try again.',
  },

  // ── User List ───────────────────────────────────────────────────────────────
  userList: {
    title: 'Users',
    newUser: 'New user',
    username: 'Username',
    password: 'Password',
    roles: 'Roles',
    status: 'Status',
    actions: 'Actions',
    enabled: 'Enabled',
    disabled: 'Disabled',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    disable: 'Disable',
    edit: 'Edit',
    noUsers: 'No users found.',
    errorLoad: 'Unable to load users',
    errorCreate: 'Unable to create user',
    errorUpdate: 'Unable to update user',
    errorDisable: 'Unable to disable user',
  },

  // ── User Form ───────────────────────────────────────────────────────────────
  userForm: {
    createUser: 'Create user',
    editUser: 'Edit user',
  },

  // ── Person List ─────────────────────────────────────────────────────────────
  personList: {
    title: 'Persons',
    newPerson: 'New person',
    lastName: 'Last name',
    firstName: 'First name',
    email: 'Email',
    function: 'Function',
    status: 'Status',
    actions: 'Actions',
    enabled: 'Enabled',
    disabled: 'Disabled',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    disable: 'Disable',
    edit: 'Edit',
    noPersons: 'No persons found.',
    errorLoad: 'Unable to load persons',
    errorCreate: 'Unable to create person',
    errorUpdate: 'Unable to update person',
    errorDisable: 'Unable to disable person',
  },

  // ── Person Form ─────────────────────────────────────────────────────────────
  personForm: {
    createPerson: 'Create person',
    editPerson: 'Edit person',
    functionRequired: 'Function is required',
    invalidEmail: 'Please enter a valid email',
    errorLoadFunctions: 'Unable to load available functions',
  },

  // ── Catalog Type List ────────────────────────────────────────────────────────
  catalogTypeList: {
    title: 'Catalogs',
    noTypes: 'No catalogs available.',
    errorLoad: 'Unable to load catalogs',
  },

  // ── Catalog Entry List ───────────────────────────────────────────────────────
  catalogEntryList: {
    newEntry: 'New entry',
    createEntry: 'Create entry',
    editEntry: 'Edit entry',
    label: 'Label',
    status: 'Status',
    actions: 'Actions',
    enabled: 'Enabled',
    disabled: 'Disabled',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    edit: 'Edit',
    disable: 'Disable',
    enable: 'Enable',
    noEntries: 'No entries found.',
    errorLoad: 'Unable to load entries',
    errorCreate: 'Unable to create entry. It may already exist in this catalog.',
    errorUpdate: 'Unable to update entry. It may already exist in this catalog.',
    errorToggle: 'Unable to update entry status',
  },

  // ── Population List ───────────────────────────────────────────────────────
  populationList: {
    title: 'Populations',
    newPopulation: 'New population',
    name: 'Name',
    status: 'Status',
    memberCount: 'Members',
    actions: 'Actions',
    active: 'Active',
    closed: 'Closed',
    edit: 'Edit',
    viewMembers: 'View members',
    noPopulations: 'No populations found.',
    errorLoad: 'Unable to load populations',
    errorCreate: 'Unable to create population',
    errorUpdate: 'Unable to update population',
  },

  // ── Population Form ────────────────────────────────────────────────────────
  populationForm: {
    createPopulation: 'Create population',
    editPopulation: 'Edit population',
    nameRequired: 'Population name is required',
    nameUnique: 'A population with this name already exists',
    statusRequired: 'Status is required',
    cancel: 'Cancel',
    save: 'Save',
  },

  // ── Population Members ─────────────────────────────────────────────────────
  populationMembers: {
    title: 'Members',
    addMember: 'Add member',
    personName: 'Person',
    function: 'Function',
    startDate: 'Start date',
    endDate: 'End date',
    actions: 'Actions',
    edit: 'Edit',
    errorLoad: 'Unable to load members',
    errorAdd: 'Unable to add member',
    errorUpdate: 'Unable to update membership',
    personDisabled: 'This person is disabled and cannot be added',
    functionDisabled: 'The selected function is no longer enabled',
    endDateBeforeStart: 'End date must be on or after start date',
    noMembers: 'No members in this population.',
  },

  // ── Member Form ────────────────────────────────────────────────────────────
  memberForm: {
    addMember: 'Add member',
    editMember: 'Edit membership',
    personRequired: 'Person is required',
    functionRequired: 'Function is required',
    startDateRequired: 'Start date is required',
    cancel: 'Cancel',
    save: 'Save',
  },

  // ── Languages ───────────────────────────────────────────────────────────────
  languages: {
    en: 'English',
    fr: 'French',
  },
};

export type TranslationKeys = typeof en;