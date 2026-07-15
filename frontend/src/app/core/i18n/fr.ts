import { TranslationKeys } from './en';

export const fr: TranslationKeys = {
  // ── Global ─────────────────────────────────────────────────────────────────
  loading: 'Chargement...',

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    admin: 'Admin',
    users: 'Utilisateurs',
    persons: 'Personnes',
    catalogs: 'Catalogues',    populations: 'Populations',    changePassword: 'Changer le mot de passe',
    signOut: 'Se déconnecter',
    language: 'Langue',
  },

  // ── Login ───────────────────────────────────────────────────────────────────
  login: {
    title: 'cleareq',
    subtitle: 'Connectez-vous pour continuer',
    username: "Nom d'utilisateur",
    password: 'Mot de passe',
    signIn: 'Se connecter',
    usernameRequired: "Le nom d'utilisateur est requis",
    passwordRequired: 'Le mot de passe est requis',
    invalidCredentials: "Nom d'utilisateur ou mot de passe invalide.",
  },

  // ── Home ────────────────────────────────────────────────────────────────────
  home: {
    hello: 'Bonjour,',
    welcomeBack: 'Bienvenue sur votre tableau de bord',
  },

  // ── Change Password ─────────────────────────────────────────────────────────
  changePassword: {
    title: 'Changer le mot de passe',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le nouveau mot de passe',
    submit: 'Changer le mot de passe',
    success: 'Mot de passe changé avec succès.',
    error: 'Impossible de changer le mot de passe. Vérifiez votre mot de passe actuel et réessayez.',
  },

  // ── User List ───────────────────────────────────────────────────────────────
  userList: {
    title: 'Utilisateurs',
    newUser: 'Nouvel utilisateur',
    username: "Nom d'utilisateur",
    password: 'Mot de passe',
    roles: 'Rôles',
    status: 'Statut',
    actions: 'Actions',
    enabled: 'Actif',
    disabled: 'Inactif',
    cancel: 'Annuler',
    save: 'Enregistrer',
    create: 'Créer',
    disable: 'Désactiver',
    edit: 'Modifier',
    noUsers: 'Aucun utilisateur trouvé.',
    errorLoad: 'Impossible de charger les utilisateurs',
    errorCreate: "Impossible de créer l'utilisateur",
    errorUpdate: "Impossible de mettre à jour l'utilisateur",
    errorDisable: "Impossible de désactiver l'utilisateur",
  },

  // ── User Form ───────────────────────────────────────────────────────────────
  userForm: {
    createUser: 'Créer un utilisateur',
    editUser: "Modifier l'utilisateur",
  },

  // ── Person List ─────────────────────────────────────────────────────────────
  personList: {
    title: 'Personnes',
    newPerson: 'Nouvelle personne',
    lastName: 'Nom',
    firstName: 'Prénom',
    email: 'Email',
    function: 'Fonction',
    status: 'Statut',
    actions: 'Actions',
    enabled: 'Actif',
    disabled: 'Inactif',
    cancel: 'Annuler',
    save: 'Enregistrer',
    create: 'Créer',
    disable: 'Désactiver',
    edit: 'Modifier',
    noPersons: 'Aucune personne trouvée.',
    errorLoad: 'Impossible de charger les personnes',
    errorCreate: 'Impossible de créer la personne',
    errorUpdate: 'Impossible de mettre à jour la personne',
    errorDisable: 'Impossible de désactiver la personne',
  },

  // ── Person Form ─────────────────────────────────────────────────────────────
  personForm: {
    createPerson: 'Créer une personne',
    editPerson: 'Modifier la personne',
    functionRequired: 'La fonction est requise',
    invalidEmail: 'Veuillez saisir une adresse email valide',
    errorLoadFunctions: 'Impossible de charger les fonctions disponibles',
  },

  // ── Catalog Type List ────────────────────────────────────────────────────────
  catalogTypeList: {
    title: 'Catalogues',
    noTypes: 'Aucun catalogue disponible.',
    errorLoad: 'Impossible de charger les catalogues',
  },

  // ── Catalog Entry List ───────────────────────────────────────────────────────
  catalogEntryList: {
    newEntry: 'Nouvelle entrée',
    createEntry: 'Créer une entrée',
    editEntry: "Modifier l'entrée",
    label: 'Libellé',
    status: 'Statut',
    actions: 'Actions',
    enabled: 'Actif',
    disabled: 'Inactif',
    cancel: 'Annuler',
    save: 'Enregistrer',
    create: 'Créer',
    edit: 'Modifier',
    disable: 'Désactiver',
    enable: 'Activer',
    noEntries: 'Aucune entrée trouvée.',
    errorLoad: 'Impossible de charger les entrées',
    errorCreate: "Impossible de créer l'entrée. Elle existe peut-être déjà dans ce catalogue.",
    errorUpdate: "Impossible de mettre à jour l'entrée. Elle existe peut-être déjà dans ce catalogue.",
    errorToggle: "Impossible de mettre à jour le statut de l'entrée",
  },

  // ── Population List ───────────────────────────────────────────────────────
  populationList: {
    title: 'Populations',
    newPopulation: 'Nouvelle population',
    name: 'Nom',
    status: 'Statut',
    memberCount: 'Membres',
    actions: 'Actions',
    active: 'Actif',
    closed: 'Fermé',
    edit: 'Modifier',
    viewMembers: 'Voir les membres',
    noPopulations: 'Aucune population trouvée.',
    errorLoad: 'Impossible de charger les populations',
    errorCreate: 'Impossible de créer la population',
    errorUpdate: 'Impossible de mettre à jour la population',
  },

  // ── Population Form ────────────────────────────────────────────────────────
  populationForm: {
    createPopulation: 'Créer une population',
    editPopulation: 'Modifier la population',
    nameRequired: 'Le nom de la population est requis',
    nameUnique: 'Une population avec ce nom existe déjà',
    statusRequired: 'Le statut est requis',
    cancel: 'Annuler',
    save: 'Enregistrer',
  },

  // ── Population Members ─────────────────────────────────────────────────────
  populationMembers: {
    title: 'Membres',
    addMember: 'Ajouter un membre',
    personName: 'Personne',
    function: 'Fonction',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    actions: 'Actions',
    edit: 'Modifier',
    errorLoad: 'Impossible de charger les membres',
    errorAdd: 'Impossible d\'ajouter le membre',
    errorUpdate: 'Impossible de mettre à jour l\'adhésion',
    personDisabled: 'Cette personne est désactivée et ne peut pas être ajoutée',
    functionDisabled: 'La fonction sélectionnée n\'est plus active',
    endDateBeforeStart: 'La date de fin doit être égale ou après la date de début',
    noMembers: 'Aucun membre dans cette population.',
  },

  // ── Member Form ────────────────────────────────────────────────────────────
  memberForm: {
    addMember: 'Ajouter un membre',
    editMember: 'Modifier l\'adhésion',
    personRequired: 'La personne est requise',
    functionRequired: 'La fonction est requise',
    startDateRequired: 'La date de début est requise',
    cancel: 'Annuler',
    save: 'Enregistrer',
  },

  // ── Languages ───────────────────────────────────────────────────────────────
  languages: {
    en: 'Anglais',
    fr: 'Français',
  },
};