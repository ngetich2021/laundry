export const PERMISSION_GROUPS = [
  "dashboard",
  "clients",
  "retention",
  "targets",
  "ads",
  "visits",
  "loyalty",
  "referrals",
  "reports",
  "roles",
  "users",
  "hero",
  "pricing",
] as const;

export type PermissionGroup = (typeof PERMISSION_GROUPS)[number];

export interface PermissionDef {
  key: string;
  group: PermissionGroup;
  label: string;
  description: string;
}

export const PERMISSIONS: PermissionDef[] = [
  { key: "dashboard.view", group: "dashboard", label: "View dashboard", description: "See the overview dashboard" },

  { key: "clients.view", group: "clients", label: "View clients", description: "See the client list" },
  { key: "clients.manage", group: "clients", label: "Manage clients", description: "Create and edit clients" },

  { key: "retention.view", group: "retention", label: "View retention accounts", description: "See retention accounts and balances" },
  { key: "retention.manage", group: "retention", label: "Manage retention accounts", description: "Create accounts, generate invoices, record payments" },

  { key: "targets.view", group: "targets", label: "View campaign targets", description: "See campaign targets and progress" },
  { key: "targets.manage", group: "targets", label: "Manage campaign targets", description: "Create targets and log achievements" },

  { key: "ads.view", group: "ads", label: "View ads", description: "See running/scheduled/ended ads" },
  { key: "ads.manage", group: "ads", label: "Manage ads", description: "Create and edit ad spend records" },

  { key: "visits.view", group: "visits", label: "View site visits", description: "See website visit analytics" },

  { key: "loyalty.view", group: "loyalty", label: "View loyalty cards", description: "See loyalty cards and reminders" },
  { key: "loyalty.manage", group: "loyalty", label: "Manage loyalty cards", description: "Add punches and redeem free washes" },

  { key: "referrals.view", group: "referrals", label: "View referrals", description: "See referral rewards" },
  { key: "referrals.manage", group: "referrals", label: "Manage referrals", description: "Record referrals, convert, apply rewards" },

  { key: "reports.view", group: "reports", label: "View reports", description: "See daily reports" },

  { key: "roles.manage", group: "roles", label: "Manage roles & permissions", description: "Create roles and toggle permissions" },
  { key: "users.manage", group: "users", label: "Manage users", description: "Invite staff and assign roles" },

  { key: "hero.view", group: "hero", label: "View hero/homepage slides", description: "See the homepage hero carousel content" },
  { key: "hero.manage", group: "hero", label: "Manage hero/homepage slides", description: "Add, edit, reorder and publish homepage hero slides" },

  { key: "pricing.view", group: "pricing", label: "View pricing", description: "See the public pricing shown on the website" },
  { key: "pricing.manage", group: "pricing", label: "Manage pricing", description: "Edit the prices shown on the public website" },
];

export const DEFAULT_MANAGER_PERMISSION_KEYS = [
  "dashboard.view",
  "clients.view",
  "clients.manage",
  "retention.view",
  "retention.manage",
  "targets.view",
  "targets.manage",
  "ads.view",
  "ads.manage",
  "visits.view",
  "loyalty.view",
  "loyalty.manage",
  "referrals.view",
  "referrals.manage",
  "reports.view",
  "hero.view",
  "hero.manage",
  "pricing.view",
  "pricing.manage",
];

export const DEFAULT_SELLER_PERMISSION_KEYS = [
  "dashboard.view",
  "clients.view",
  "clients.manage",
  "retention.view",
  "targets.view",
  "loyalty.view",
  "loyalty.manage",
  "referrals.view",
  "referrals.manage",
];
