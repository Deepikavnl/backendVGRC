import {
  LayoutDashboard,
  HelpCircle,
  FolderTree,
  LayoutTemplate,
  Building2,
  ClipboardList,
  UserCheck,
  AlertTriangle,
  FileBarChart,
  Bell,
  ScrollText,
  Settings,
  Layers,
  Tags,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to?: string;
  icon: LucideIcon;
  badge?: string;
  children?: {
    label: string;
    to: string;
  }[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/* ===========================
   ADMIN NAVIGATION
=========================== */

export const internalNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Assessment Design",
    items: [
      {
        label: "Question Master",
        icon: HelpCircle,
        children: [
          {
            label: "Question Bank",
            to: "/questions",
          },
          {
            label: "Topics",
            to: "/topics",
          },
        ],
      },

      {
        label: "Templates",
        icon: LayoutTemplate,
        children: [
          {
            label: "All Templates",
            to: "/templates",
          },
          {
            label: "Template Builder",
            to: "/templates/builder",
          },
        ],
      },
    ],
  },

  {
    title: "Third-Party Management",
    items: [
      {
        label: "Entities",
        to: "/entities",
        icon: Building2,
      },

      {
        label: "Assessments",
        icon: ClipboardList,
        children: [
          {
            label: "All Assessments",
            to: "/assessments",
          },
          {
            label: "New Assessment",
            to: "/assessments/new",
          },
        ],
      },

      {
        label: "Reviewer Workspace",
        to: "/reviewer",
        icon: UserCheck,
      },

      {
        label: "Findings",
        to: "/findings",
        icon: AlertTriangle,
      },
    ],
  },

  {
    title: "Insights & Governance",
    items: [
      {
        label: "Reports",
        to: "/reports",
        icon: FileBarChart,
      },

      {
        label: "Notifications",
        to: "/notifications",
        icon: Bell,
      },

      {
        label: "Audit Logs",
        to: "/audit",
        icon: ScrollText,
      },

      {
        label: "Settings",
        to: "/settings",
        icon: Settings,
      },
    ],
  },
];

/* ===========================
   REVIEWER NAVIGATION
=========================== */

export const reviewerNav: NavGroup[] = [
  {
    title: "Reviewer",
    items: [
      {
        label: "Reviewer Workspace",
        to: "/reviewer",
        icon: UserCheck,
      },

      {
        label: "Findings",
        to: "/findings",
        icon: AlertTriangle,
      },
    ],
  },
];

/* ===========================
   VENDOR NAVIGATION
=========================== */

export const vendorNav: NavGroup[] = [
  {
    title: "Vendor Portal",
    items: [
      {
        label: "Dashboard",
        to: "/vendor",
        icon: LayoutDashboard,
      },

      {
        label: "My Assessments",
        to: "/vendor/assessments",
        icon: ClipboardList,
      },

      {
        label: "Submission History",
        to: "/vendor/history",
        icon: Layers,
      },

      {
        label: "Messages",
        to: "/vendor/messages",
        icon: Bell,
      },
    ],
  },
];

export { FolderTree, Tags };