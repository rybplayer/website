export type PublicationLinkKind =
  | "conference"
  | "paper"
  | "preprint"
  | "code"
  | "slides"

export type PublicationLink = {
  kind: PublicationLinkKind
  href?: string
  label?: string
}

export type Publication = {
  title: string
  authors: string[]
  date: Date
  datePrecision?: "day" | "month" | "year"
  description: string
  featured?: boolean
  links: PublicationLink[]
}

export const publications: Publication[] = [
  {
    title:
      "Newton strata realization for hypersurfaces via explicit p-adic cohomology",
    authors: [
      "Ryan Batubara",
      "Jack J. Garzella",
      "Yongyuan Huang",
      "Maximus Mellberg",
    ],
    date: new Date("2026-02-27T00:00:00Z"),
    description:
      "Algorithms and GPU-accelerated software for computing zeta functions and Newton polygons of projective hypersurfaces over finite fields, together with new examples of varieties with specified Newton polygons.",
    links: [
      {
        kind: "conference",
        label: "ANTS XVII",
        href: "https://antsmath.org/ANTSXVII/papers.html#batubara_garzella_huang_mellberg",
      },
      {
        kind: "paper",
        href: "https://antsmath.org/ANTSXVII/papers/antsxvii-batubara_garzella_huang_mellberg-paper.pdf",
      },
      { kind: "preprint", href: "https://arxiv.org/abs/2602.24155" },
      {
        kind: "code",
        href: "https://github.com/UCSD-computational-number-theory/DeRham.jl",
      },
      {
        kind: "slides",
        href: "https://antsmath.org/ANTSXVII/slides/antsxvii-batubara_garzella_huang_mellberg-slides.pdf",
      },
    ],
  },
  {
    title:
      "On the Universality of Comparability Grids for Measurement-Based Quantum Computation",
    authors: ["Ryan Batubara"],
    date: new Date("2026-06-01T00:00:00Z"),
    datePrecision: "month",
    featured: true,
    description:
      "An undergraduate honors thesis presenting several approaches toward proving that comparability grids are universal resources for measurement-based quantum computation.",
    links: [
      {
        kind: "paper",
        href: "https://math.ucsd.edu/sites/math.ucsd.edu/files/undergrad/honors-program/honors-theses/2025-2026/Batubara%2CRyan_Honors_Thesis.pdf",
      },
      {
        kind: "slides",
        href: "https://github.com/rybplayer/thesis/blob/main/slides/slides.pdf",
      },
    ],
  },
  {
    title:
      "K3 surfaces of any Artin–Mazur height over F₅ and F₇ via quasi-F-split singularities and GPU acceleration",
    authors: ["Ryan Batubara", "Jack J. Garzella", "Alex Pan"],
    date: new Date("2025-02-18T00:00:00Z"),
    description:
      "A fast algorithm for calculating the Artin–Mazur height of Calabi–Yau hypersurfaces, used to construct quartic K3 surfaces of every possible height over F₅ and F₇.",
    links: [
      { kind: "conference", label: "In Progress" },
      { kind: "preprint", href: "https://arxiv.org/abs/2502.12428" },
      {
        kind: "code",
        href: "https://github.com/jjgarzella/MMPSingularities.jl",
      },
    ],
  },
]
