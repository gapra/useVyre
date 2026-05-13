export interface NavItem {
  title: string;
  href:  string;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction",   href: "/docs/getting-started" },
      { title: "Installation",   href: "/docs/installation" },
      { title: "AI Context",     href: "/docs/ai-context" },
      { title: "Tokens",         href: "/docs/tokens" },
      { title: "Theming",        href: "/docs/theming" },
      { title: "Migration Guide", href: "/docs/migration" },
    ],
  },
  {
    title: "Examples",
    items: [
      { title: "All examples",   href: "/examples"           },
      { title: "Dashboard",      href: "/examples/dashboard" },
      { title: "Sign-in",        href: "/examples/auth"      },
    ],
  },
  {
    title: "AI Tooling",
    items: [
      { title: "AI Context",        href: "/docs/ai-tooling/ai-context-pkg"   },
      { title: "Validate AI Context", href: "/docs/ai-tooling/validate"         },
      { title: "ESLint Plugin",     href: "/docs/ai-tooling/eslint-plugin"     },
      { title: "MCP Server",        href: "/docs/ai-tooling/mcp-server"        },
      { title: "Prompt Templates",  href: "/docs/ai-tooling/prompt-templates"  },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Accordion",     href: "/docs/components/accordion"     },
      { title: "Alert",         href: "/docs/components/alert"         },
      { title: "Avatar",        href: "/docs/components/avatar"        },
      { title: "Badge",         href: "/docs/components/badge"         },
      { title: "Breadcrumb",    href: "/docs/components/breadcrumb"    },
      { title: "Button",            href: "/docs/components/button"            },
      { title: "Button Group",      href: "/docs/components/button-group",      badge: "soon" },
      { title: "Calendar",          href: "/docs/components/calendar"          },
      { title: "Card",              href: "/docs/components/card"              },
      { title: "Checkbox",          href: "/docs/components/checkbox"          },
      { title: "Combobox",          href: "/docs/components/combobox",          badge: "soon" },
      { title: "Command",           href: "/docs/components/command"           },
      { title: "Data Grid",         href: "/docs/components/data-grid",         badge: "soon" },
      { title: "Date Range Picker", href: "/docs/components/date-range-picker", badge: "soon" },
      { title: "Dropdown Menu",     href: "/docs/components/dropdown-menu"     },
      { title: "Input",             href: "/docs/components/input"             },
      { title: "Item",              href: "/docs/components/item",              badge: "soon" },
      { title: "Kanban",            href: "/docs/components/kanban",            badge: "soon" },
      { title: "Label",             href: "/docs/components/label"             },
      { title: "Modal",             href: "/docs/components/modal"             },
      { title: "Pagination",        href: "/docs/components/pagination"        },
      { title: "Popover",           href: "/docs/components/popover"           },
      { title: "Progress",          href: "/docs/components/progress"          },
      { title: "Rich Text Editor",  href: "/docs/components/rich-text-editor",  badge: "soon" },
      { title: "Select",            href: "/docs/components/select"            },
      { title: "Separator",         href: "/docs/components/separator"         },
      { title: "Sheet",             href: "/docs/components/sheet"             },
      { title: "Sidebar",           href: "/docs/components/sidebar"           },
      { title: "Skeleton",          href: "/docs/components/skeleton"          },
      { title: "Slider",            href: "/docs/components/slider"            },
      { title: "Switch",            href: "/docs/components/switch"            },
      { title: "Table",             href: "/docs/components/table"             },
      { title: "Tabs",              href: "/docs/components/tabs"              },
      { title: "Tags Input",        href: "/docs/components/tags-input",        badge: "soon" },
      { title: "Toast",             href: "/docs/components/toast"             },
      { title: "Tooltip",           href: "/docs/components/tooltip"           },
      { title: "Typography",        href: "/docs/components/typography"        },
    ],
  },
];
