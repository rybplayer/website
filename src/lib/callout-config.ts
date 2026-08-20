export const CALLOUTS = {
  note: {
    icon: "info-circle",
    accent: "#0090ff",
    description: "General information or comments",
  },
  tip: {
    icon: "lightbulb",
    accent: "#30a46c",
    description: "Helpful advice or shortcuts",
  },
  warning: {
    icon: "danger-triangle",
    accent: "#ffc53d",
    description: "Potential pitfalls or misconceptions",
  },
  caution: {
    icon: "shield-warning",
    accent: "#e5484d",
    description: "Destructive or harmful actions",
  },
  danger: {
    icon: "shield-warning",
    accent: "#e5484d",
    description: "Destructive or harmful actions",
  },
  important: {
    icon: "bell",
    accent: "#8e4ec6",
    description: "Critical information",
  },
  definition: {
    icon: "info-circle",
    accent: "#8e4ec6",
    description: "Terms or concepts",
  },
  theorem: {
    icon: "bell",
    accent: "#12a594",
    description: "Proven mathematical statements",
  },
  lemma: {
    icon: "lightbulb",
    accent: "#0d9bcd",
    description: "Helper theorems",
  },
  proof: {
    icon: "shield-warning",
    accent: "#838383",
    description: "Logical arguments",
  },
  corollary: {
    icon: "bell",
    accent: "#0d9bcd",
    description: "Results following from theorems",
  },
  proposition: {
    icon: "info-circle",
    accent: "#838383",
    description: "Important minor statements",
  },
  axiom: {
    icon: "bell",
    accent: "#8e4ec6",
    description: "Fundamental assumptions",
  },
  conjecture: {
    icon: "danger-triangle",
    accent: "#d6409f",
    description: "Unproven statements believed true",
  },
  notation: {
    icon: "info-circle",
    accent: "#838383",
    description: "Notation explanations",
  },
  remark: {
    icon: "info-circle",
    accent: "#838383",
    description: "Additional comments",
  },
  intuition: {
    icon: "lightbulb",
    accent: "#ffc53d",
    description: "Intuitive reasoning",
  },
  recall: {
    icon: "info-circle",
    accent: "#3e63dd",
    description: "Previously introduced material",
  },
  explanation: {
    icon: "lightbulb",
    accent: "#99d52a",
    description: "Deeper insights",
  },
  example: {
    icon: "info-circle",
    accent: "#30a46c",
    description: "Concrete examples",
  },
  exercise: {
    icon: "danger-triangle",
    accent: "#3e63dd",
    description: "Practice problems",
  },
  problem: {
    icon: "danger-triangle",
    accent: "#f76b15",
    description: "Problems to solve",
  },
  answer: {
    icon: "lightbulb",
    accent: "#12a594",
    description: "Short answers",
  },
  solution: {
    icon: "lightbulb",
    accent: "#30a46c",
    description: "Detailed solutions",
  },
  summary: {
    icon: "bell",
    accent: "#0d9bcd",
    description: "Key-point summaries",
  },
  puzzle: {
    icon: "lightbulb",
    accent: "#46a758",
    description: "Puzzles and brain teasers",
  },
} as const

export type CalloutVariant = keyof typeof CALLOUTS
