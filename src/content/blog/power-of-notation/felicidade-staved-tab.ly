music = \relative c' {
  \time 4/4
  \stemDown
  a,8-.\5
  <e'\4 a\3>8-.[ <e\4 a\3>16-.] r16
  <e\4 a\3>8-.[ <ees\4 a\3>16-.] r16
  <ees\4 a\3>8-.[ <ees\4 a\3>16-.] r16
  <ees\4 a\3>8-. |
}

\score {
  \new StaffGroup <<
    \new Staff {
      \clef "treble_8"
      \music
    }
    \new TabStaff {
      \tabFullNotation
      \music
    }
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
