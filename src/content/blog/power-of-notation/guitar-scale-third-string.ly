music = \relative c' {
  \time 4/4
  g4\3 a\3 b\3 c\3 |
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
