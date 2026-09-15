/**
 * @typedef {{ anchorTop: number, height: number }} SidenoteMeasurement
 * @typedef {{ top: number | null, clip: number, visible: boolean }} SidenotePlacement
 */

/**
 * Places margin notes near their references at full height whenever the active
 * notes fit in the rail. Only overfull groups use readable collision previews;
 * the selected note receives its full measured height and displaces notes below.
 *
 * @param {readonly SidenoteMeasurement[]} notes
 * @param {{ railHeight: number, previewHeight: number, gap: number, expandedIndex?: number }} options
 * @returns {SidenotePlacement[]}
 */
export function placeSidenotes(notes, options) {
  const { railHeight, previewHeight, gap, expandedIndex = -1 } = options
  const placements = notes.map(() => ({
    top: /** @type {number | null} */ (null),
    clip: 0,
    visible: false,
  }))
  const active = notes
    .map((note, index) => ({ ...note, index }))
    .filter(
      ({ anchorTop }) => anchorTop > -previewHeight && anchorTop < railHeight,
    )

  const fullHeight = active.reduce((total, note) => total + note.height, 0)
  const fullLayoutFits =
    fullHeight + Math.max(0, active.length - 1) * gap <= railHeight

  if (fullLayoutFits && expandedIndex < 0) {
    let cursor = 0
    for (const note of active) {
      const top = Math.max(note.anchorTop, cursor)
      placements[note.index].top = top
      cursor = top + note.height + gap
    }

    const last = active.at(-1)
    if (last) {
      const lastPlacement = placements[last.index]
      lastPlacement.top = Math.min(
        lastPlacement.top ?? last.anchorTop,
        railHeight - last.height,
      )

      for (let position = active.length - 2; position >= 0; position--) {
        const note = active[position]
        const next = active[position + 1]
        const nextTop = placements[next.index].top ?? next.anchorTop
        placements[note.index].top = Math.min(
          placements[note.index].top ?? note.anchorTop,
          nextTop - gap - note.height,
        )
      }

      const firstTop = placements[active[0].index].top ?? 0
      if (firstTop < 0) {
        for (const note of active) {
          const placement = placements[note.index]
          if (placement.top !== null) placement.top -= firstTop
        }
      }
    }

    for (const note of active) {
      placements[note.index].visible = true
    }
    return placements
  }

  let cursor = -previewHeight
  for (const note of active) {
    const top = Math.max(note.anchorTop, cursor)
    placements[note.index].top = top
    const reserved =
      note.index === expandedIndex
        ? Math.min(note.height, railHeight)
        : Math.min(note.height, previewHeight)
    cursor = top + reserved + gap
  }

  const expanded = active.find(({ index }) => index === expandedIndex)
  if (expanded) {
    const visibleHeight = Math.min(expanded.height, railHeight)
    const initial = placements[expanded.index].top ?? expanded.anchorTop
    const top = Math.max(0, Math.min(initial, railHeight - visibleHeight))
    placements[expanded.index].top = top

    cursor = top + visibleHeight + gap
    for (const note of active) {
      if (note.index <= expanded.index) continue
      const nextTop = Math.max(note.anchorTop, cursor)
      placements[note.index].top = nextTop
      cursor = nextTop + Math.min(note.height, previewHeight) + gap
    }
  }

  for (let position = 0; position < active.length; position++) {
    const note = active[position]
    const placement = placements[note.index]
    const top = placement.top
    if (top === null) continue

    const next = active[position + 1]
    const nextTop = next ? placements[next.index].top : null
    const available = Math.max(
      0,
      (nextTop ?? railHeight) - top - (next ? gap : 0),
    )
    placement.clip = Math.max(0, note.height - available)
    placement.visible = available > 0 && top < railHeight
  }

  return placements
}
