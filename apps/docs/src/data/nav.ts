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
      { title: "Layout & Spacing", href: "/docs/layout" },
      { title: "Migration Guide", href: "/docs/migration" },
    ],
  },
  {
    title: "Examples",
    items: [
      { title: "All examples",   href: "/examples"                  },
      { title: "Blocks",         href: "/docs/blocks"               },
      { title: "Dashboard app",  href: "/examples/dashboard-app/"   },
      { title: "Dashboard",      href: "/examples/dashboard"        },
      { title: "Sign-in",        href: "/examples/auth"             },
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
      { title: "Box",           href: "/docs/components/box"           },
      { title: "Breadcrumb",    href: "/docs/components/breadcrumb"    },
      { title: "Button",            href: "/docs/components/button"            },
      { title: "Button Group",      href: "/docs/components/button-group"                       },
      { title: "Calendar",          href: "/docs/components/calendar"          },
      { title: "Card",              href: "/docs/components/card"              },
      { title: "Carousel",          href: "/docs/components/carousel"          },
      { title: "Charts",            href: "/docs/components/charts"            },
      { title: "Checkbox",          href: "/docs/components/checkbox"          },
      { title: "Combobox",          href: "/docs/components/combobox"                          },
      { title: "Command",           href: "/docs/components/command"           },
      { title: "Conversation",      href: "/docs/components/conversation"      },
      { title: "Data Grid",         href: "/docs/components/data-grid"                         },
      { title: "Date Picker",       href: "/docs/components/date-picker"                       },
      { title: "Date Range Picker", href: "/docs/components/date-range-picker"               },
      { title: "Dropdown Menu",     href: "/docs/components/dropdown-menu"     },
      { title: "Empty State",       href: "/docs/components/empty-state"       },
      { title: "Field",             href: "/docs/components/field"             },
      { title: "Form",              href: "/docs/components/form"              },
      { title: "Grid",              href: "/docs/components/grid"              },
      { title: "Input",             href: "/docs/components/input"             },
      { title: "Item",              href: "/docs/components/item"              },
      { title: "Kanban",            href: "/docs/components/kanban"            },
      { title: "Label",             href: "/docs/components/label"             },
      { title: "Modal",             href: "/docs/components/modal"             },
      { title: "Number Input",      href: "/docs/components/number-input"      },
      { title: "OTP Input",         href: "/docs/components/otp-input"         },
      { title: "Pagination",        href: "/docs/components/pagination"        },
      { title: "Popover",           href: "/docs/components/popover"           },
      { title: "Progress",          href: "/docs/components/progress"          },
      { title: "Radio",             href: "/docs/components/radio"             },
      { title: "Rich Text Editor",  href: "/docs/components/rich-text-editor"   },
      { title: "Select",            href: "/docs/components/select"            },
      { title: "Separator",         href: "/docs/components/separator"         },
      { title: "Sheet",             href: "/docs/components/sheet"             },
      { title: "Sidebar",           href: "/docs/components/sidebar"           },
      { title: "Skeleton",          href: "/docs/components/skeleton"          },
      { title: "Slider",            href: "/docs/components/slider"            },
      { title: "Stack",             href: "/docs/components/stack"            },
      { title: "Stat",              href: "/docs/components/stat"              },
      { title: "Stepper",           href: "/docs/components/stepper"           },
      { title: "Switch",            href: "/docs/components/switch"            },
      { title: "Table",             href: "/docs/components/table"             },
      { title: "Tabs",              href: "/docs/components/tabs"              },
      { title: "Tag",               href: "/docs/components/tag"                               },
      { title: "Tags Input",        href: "/docs/components/tags-input"                        },
      { title: "Timeline",          href: "/docs/components/timeline"          },
      { title: "Toast",             href: "/docs/components/toast"             },
      { title: "Toggle Group",      href: "/docs/components/toggle-group"      },
      { title: "Tooltip",           href: "/docs/components/tooltip"           },
      { title: "Tree",              href: "/docs/components/tree"              },
      { title: "Typography",        href: "/docs/components/typography"        },
    ],
  },
];
