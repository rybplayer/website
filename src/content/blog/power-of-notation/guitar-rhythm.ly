music = \relative c' {
  \time 4/4
  g8\3 a4.\3 b4\3 c4\3 |
}

\score {
  \new StaffGroup <<
    \new Staff {
      \clef "treble_8"
      \music
    }
    \new TabStaff { \music }
  >>

  \layout {
    indent = 0
    ragged-right = ##t
    \context {
      \Staff
      \omit StringNumber
    }
  }
}
