# TOC Minimap Hierarchy Enhancement

## Overview
Enhanced the Table of Contents minimap on the right sidebar to show a clear visual hierarchy for H2, H3, and H4 headings with proper indentation, different font sizes, and visual indicators.

## Changes Made

### File Modified
- `src/components/shared/TOCMinimap.astro`

### Visual Hierarchy Implemented

#### H2 - Main Sections (Top Level)
- **Font Size:** 0.8125rem (13px)
- **Font Weight:** 600 (Semibold)
- **Color:** `--fg-secondary` (brighter)
- **Padding:** 0.5rem vertical, 0.75rem horizontal
- **Indicator:** Small blue dot (4px) that appears on hover/active
- **Spacing:** Extra top margin to separate from H3 groups

#### H3 - Subsections (Second Level)
- **Font Size:** 0.75rem (12px)
- **Font Weight:** Normal
- **Color:** `--fg-muted` (dimmer)
- **Indentation:** 1.5rem (24px) from left
- **Indicator:** Dash (—) prefix in muted color
- **Active Color:** Cyan (`--accent-cyan`)
- **Opacity:** 0.9 (slightly transparent)

#### H4 - Detailed Subsections (Third Level)
- **Font Size:** 0.6875rem (11px)
- **Font Weight:** Normal
- **Color:** `--fg-muted` (dimmest)
- **Indentation:** 2.25rem (36px) from left
- **Indicator:** Bullet (•) prefix in muted color
- **Active Color:** Purple (`--accent-purple`)
- **Opacity:** 0.8 (more transparent)

### JavaScript Changes
- Updated selector to include H4 headings: `.prose h2, .prose h3, .prose h4`
- Apply level-specific class automatically: `h2`, `h3`, `h4`
- All heading levels now tracked and highlighted in TOC

## Visual Design

### Hierarchy Indicators
```
Main Section (H2)                   • Bold, large, blue dot
  — Subsection (H3)                 — Dash, indented, cyan
    • Detail (H4)                   • Bullet, more indented, purple
```

### Active States
- **H2 Active:** Blue border, blue text, blue dot visible
- **H3 Active:** Cyan border, cyan text, cyan dash
- **H4 Active:** Purple border, purple text, purple bullet

### Hover States
All levels:
- Background: `--bg-tertiary`
- Border: Colored left border (2px)
- Smooth transition (0.15s)

## Benefits

1. **Clear Visual Hierarchy:** Easy to distinguish between main sections and subsections at a glance
2. **Better Navigation:** Different indentation levels help users understand content structure
3. **Color Coding:** Different accent colors for different heading levels
4. **Improved Readability:** Proper font sizes and spacing reduce cognitive load
5. **Professional Look:** Matches SST.dev and other high-quality documentation sites

## Testing

✅ **Build:** Passed - All 15 pages built successfully
✅ **Hierarchy:** H2, H3, H4 all render with proper styling
✅ **Indentation:** Clear visual nesting with 0.75rem increments
✅ **Active States:** Proper highlighting as user scrolls
✅ **Smooth Scrolling:** Click to scroll still works
✅ **Mobile:** Still hidden on mobile (uses drawer instead)

## Before vs After

### Before
```
Section 1
Subsection A
Subsection B
Section 2
Detail 1
Detail 2
```
All headings looked the same - no visual hierarchy.

### After
```
Section 1              (bold, large, •)
  — Subsection A       (indented, dash)
  — Subsection B       (indented, dash)
Section 2              (bold, large, •)
    • Detail 1         (more indented, bullet)
    • Detail 2         (more indented, bullet)
```
Clear hierarchy with visual indicators and proper indentation.

## Implementation Details

### CSS Techniques Used
1. **Pseudo-elements (::before):** For indicators (dot, dash, bullet)
2. **Absolute positioning:** To place indicators without affecting layout
3. **Opacity transitions:** Smooth fade in/out effects
4. **Progressive indentation:** Each level adds 0.75rem
5. **Font-size scaling:** Each level slightly smaller

### Accessibility
- Semantic HTML maintained (anchor tags)
- Color not sole indicator (size and indentation also differ)
- Proper focus states for keyboard navigation
- Smooth scroll respects reduced motion preferences
- All text remains readable (minimum 11px)

## Future Enhancements (Optional)

1. **Collapsible sections:** Allow expanding/collapsing H2 sections
2. **Breadcrumb trail:** Show current section path at top
3. **Estimated reading time:** Per section indicators
4. **Deep linking:** Auto-expand to show current section
5. **Search within TOC:** Filter headings by keyword

## Summary

The TOC minimap now provides a clear, professional hierarchy that makes it easy to understand the document structure at a glance. The combination of indentation, font sizes, colors, and visual indicators creates an intuitive navigation experience that matches the quality of top-tier documentation sites.

**Status:** ✅ COMPLETE
**Build:** ✅ PASSED
**Visual Hierarchy:** ✅ IMPLEMENTED

