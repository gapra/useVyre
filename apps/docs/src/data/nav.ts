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
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Button",  href: "/docs/components/button"  },
      { title: "Badge",   href: "/docs/components/badge"   },
      { title: "Card",    href: "/docs/components/card"    },
      { title: "Input",   href: "/docs/components/input"   },
      { title: "Modal",   href: "/docs/components/modal"   },
      { title: "Select",  href: "/docs/components/select"  },
      { title: "Tabs",    href: "/docs/components/tabs"    },
      { title: "Toast",   href: "/docs/components/toast"   },
      { title: "Tooltip", href: "/docs/components/tooltip" },
    ],
  },
];
