export const colors = {
  light: {
    background: "oklch(0.9941 0.01 130)",
    foreground: "oklch(0.12 0 130)",
    primary: "oklch(0.5 0.1 130)",
    accent: "oklch(0.75 0.07 130)",
    "inline-code-background": "oklch(0.88 0.035 130)",
    "block-code-background": "oklch(0.7 0.055 130)",
    muted: "oklch(0.9 0.03 130)",
    "muted-foreground": "oklch(0.18 0 130)",
    border: "oklch(0.9 0 130)",
    ring: "oklch(0.7 0 130)",
  },
  dark: {
    background: "oklch(0.12 0 130)",
    foreground: "oklch(0.9941 0.01 130)",
    primary: "oklch(0.5 0.1 130)",
    accent: " oklch(0.15 0.2 130)",
    "inline-code-background": "oklch(0.2 0.035 130)",
    "block-code-background": "oklch(0.11 0.03 130)",
    muted: "oklch(0.2 0.1 130)",
    "muted-foreground": "oklch(0.85 0.01 130)",
    border: "oklch(0.25 0 130)",
    ring: "oklch(0.9941 0.01 130)",
  },
} as const

export type Theme = keyof typeof colors
export type ColorName = keyof (typeof colors)["light"]
