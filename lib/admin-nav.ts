import {
  LayoutDashboard,
  Users,
  Wallet,
  Target,
  Megaphone,
  Globe,
  Gift,
  Share2,
  FileBarChart,
  ShieldCheck,
  UserCog,
  Image as ImageIcon,
  Tag,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, permission: "dashboard.view" },
  { href: "/admin/clients", label: "Clients", icon: Users, permission: "clients.view" },
  { href: "/admin/retention", label: "Retention Accounts", icon: Wallet, permission: "retention.view" },
  { href: "/admin/targets", label: "Campaign Targets", icon: Target, permission: "targets.view" },
  { href: "/admin/ads", label: "Ads", icon: Megaphone, permission: "ads.view" },
  { href: "/admin/hero", label: "Hero Slides", icon: ImageIcon, permission: "hero.view" },
  { href: "/admin/pricing", label: "Pricing", icon: Tag, permission: "pricing.view" },
  { href: "/admin/visits", label: "Site Visits", icon: Globe, permission: "visits.view" },
  { href: "/admin/loyalty", label: "Loyalty Cards", icon: Gift, permission: "loyalty.view" },
  { href: "/admin/referrals", label: "Referrals", icon: Share2, permission: "referrals.view" },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart, permission: "reports.view" },
  { href: "/admin/settings/roles", label: "Roles & Permissions", icon: ShieldCheck, permission: "roles.manage" },
  { href: "/admin/settings/users", label: "Users", icon: UserCog, permission: "users.manage" },
];
