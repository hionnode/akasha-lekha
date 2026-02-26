<!-- 486f4685-e256-4007-87dc-975225821299 939a332d-4d63-434e-9ecc-9bff51673aa1 -->
# UX/QA Improvements Plan

## Overview

This plan addresses 35+ issues identified in the QA reports. Each issue includes:

- **Priority Level**: Critical, High, Medium, or Low
- **Detailed Issue Description**: What's wrong, where it occurs, and why it matters
- **Acceptance Criteria**: Specific, testable conditions that define when the issue is fixed
- **Implementation Notes**: What approach was followed, know how, and know why

---

## 🔴 CRITICAL PRIORITY - Phase 1 (Must Fix Immediately)

### Issue #1: Prose Styles Not Working

**Priority:** 🔴 CRITICAL
**Location:** All blog posts (`src/pages/blog/[slug].astro`), guides, and code pages
**Files to Modify:** `package.json`, `astro.config.mjs`, `src/styles/global.css`
**Status:** ✅ COMPLETED

**Issue Detail:**

- The codebase uses `prose prose-invert` Tailwind classes on markdown content (line 66 in `[slug].astro`)
- Tailwind Typography plugin (`@tailwindcss/typography`) is NOT installed in `package.json`
- Result: All markdown content (headings, lists, links, blockquotes, paragraphs) lacks proper typography styling
- Content appears unstyled, making articles hard to read and unprofessional
- Affects all blog posts, guides, and any page rendering markdown content

**Acceptance Criteria:**

- [x] `@tailwindcss/typography` package is installed in `package.json`
- [x] Plugin is configured in `astro.config.mjs` or Tailwind config
- [x] Blog post pages display properly styled headings (h1-h6 with appropriate sizes)
- [x] Lists (ul, ol) have proper spacing and indentation
- [x] Links have hover states and proper colors
- [x] Blockquotes are visually distinct
- [x] Paragraphs have appropriate line height and spacing
- [x] Visual verification: Open any blog post and confirm typography matches design system

**Implementation Notes:**

**Approach:** Installed `@tailwindcss/typography` package via pnpm and configured it for Tailwind CSS v4.

**Know How:**
- Used `pnpm add -D @tailwindcss/typography` to install the plugin
- For Tailwind v4, the plugin is configured using `@plugin` directive in CSS
- Added `@plugin "@tailwindcss/typography";` to `src/styles/global.css` after the `@import "tailwindcss";` statement

**Know Why:**
- Tailwind CSS v4 uses a different plugin system than v3 - plugins are imported via CSS `@plugin` directive rather than JavaScript config
- The `prose` classes are utility classes provided by the typography plugin that automatically style markdown content
- `prose-invert` variant is needed for dark theme support, which matches the site's Tokyo Night color scheme
- This approach ensures all markdown content across blog posts, guides, and code pages gets consistent, readable typography

---

### Issue #2: Mobile Navigation Completely Broken

**Priority:** 🔴 CRITICAL
**Location:** `src/components/layout/Header.astro` (all pages)
**Files to Modify:** `src/components/layout/Header.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- Navigation links ("Blog", "Guides", "Code Library") overflow on mobile viewport (375px width)
- "Code Library" text is partially cut off or wraps awkwardly
- No hamburger menu exists - desktop navigation is shown on mobile
- Navigation becomes completely unusable on mobile devices
- Users cannot access main sections of the site on mobile
- Browser testing confirmed: Links overflow on 375x667 viewport

**Acceptance Criteria:**

- [x] Hamburger menu icon (☰) appears on screens < 768px width
- [x] Desktop navigation links are hidden on mobile
- [x] Clicking hamburger opens mobile menu (overlay or drawer)
- [x] Mobile menu displays all navigation items ("Blog", "Guides", "Code Library")
- [x] Close button (X) or backdrop click closes mobile menu
- [x] Menu is accessible via keyboard (Tab navigation)
- [x] Visual verification: Test on 375px viewport - all nav items visible and clickable
- [x] No text overflow or cutoff on mobile

**Implementation Notes:**

**Approach:** Implemented a responsive hamburger menu with slide-in overlay that works on mobile devices.

**Know How:**
- Used Tailwind's `md:hidden` and `hidden md:flex` classes to show/hide elements based on screen size
- Created hamburger button with SVG icons (hamburger and close) that toggle
- Implemented mobile menu as fixed overlay with `translate-x-full` initially (off-screen) and `translate-x-0` when open
- Used CSS transitions (`transition-transform duration-300`) for smooth slide animation
- Added JavaScript event handlers for:
  - Button click to toggle menu
  - Backdrop click to close menu
  - Escape key to close menu
  - Astro View Transitions navigation to auto-close menu
- Prevented body scroll when menu is open (`document.body.style.overflow = 'hidden'`)
- Added proper ARIA attributes (`aria-expanded`, `aria-hidden`, `aria-label`) for accessibility
- Also implemented active navigation state highlighting (Issue #6) while working on this

**Know Why:**
- Mobile-first responsive design is essential - most users access sites on mobile devices
- Slide-in overlay pattern is standard UX that users expect
- Fixed positioning with backdrop prevents interaction with page content when menu is open
- Auto-closing on navigation improves UX by not leaving menu open after navigation
- Keyboard accessibility (Escape key, Tab navigation) is required for WCAG compliance
- Using `translate-x` instead of `display: none` allows CSS transitions to work smoothly
- TypeScript type assertions (`as HTMLButtonElement | null`) are needed because `getElementById` returns `HTMLElement | null`, and we need to access button-specific properties

---

### Issue #3: Invalid HTML Structure - Nested Anchor Tags

**Priority:** 🔴 CRITICAL
**Location:** `src/components/blog/PostCard.astro`
**Files to Modify:** `src/components/blog/PostCard.astro`, potentially `src/components/blog/TagPill.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- Entire `<article>` element is wrapped in an `<a>` tag (line 27)
- Tag pills inside the article also have click handlers (line 42-46)
- This creates nested interactive elements (anchor inside anchor), which is invalid HTML
- Screen readers and accessibility tools cannot properly parse this structure
- Browser behavior is unpredictable - some browsers may ignore nested anchors
- Tag clicks use `stopPropagation()` to prevent navigation, creating confusing UX
- HTML validation will fail on this structure

**Acceptance Criteria:**

- [x] No nested anchor tags in HTML output
- [x] PostCard HTML validates (use HTML validator)
- [x] Entire card is still clickable to navigate to post
- [x] Tag pills are clickable and filter posts (without preventing card click)
- [x] Structure uses proper semantic HTML (no nested interactive elements)
- [x] Accessibility: Screen reader can navigate both card link and tag links independently
- [x] Visual verification: Inspect HTML - no `<a>` tags nested inside other `<a>` tags

**Implementation Notes:**

**Approach:** Restructured the component to remove nested anchors while maintaining clickability and functionality.

**Know How:**
- Removed the wrapper `<a>` tag around the entire article
- Made only the title an anchor link (`<a href={/blog/${slug}>`)
- Added `data-post-card` and `data-post-slug` attributes to the article for JavaScript targeting
- Implemented click handler on the article element that:
  - Checks if click target is within tag container or tag pill
  - Only navigates if click is not on tags
  - Uses `window.location.href` for navigation
- Added keyboard accessibility:
  - `tabindex="0"` to make card focusable
  - `role="button"` for semantic meaning
  - `aria-label` with descriptive text
  - Enter/Space key handlers for keyboard navigation
- Tag pills remain clickable via their existing JavaScript handlers in `TagPill.astro`
- Re-initialized event handlers on Astro View Transitions navigation

**Know Why:**
- HTML5 spec prohibits nested interactive elements - it's invalid markup
- Screen readers get confused by nested anchors and may skip content
- Separating concerns: title link for navigation, card click for UX, tags for filtering
- Using `data-*` attributes is semantic and allows JavaScript to target elements without classes
- Checking `closest()` prevents event bubbling issues - tags can be clicked without triggering card navigation
- Keyboard accessibility is required for users who navigate without a mouse
- Re-initialization on navigation is needed because Astro View Transitions replace DOM content, losing event listeners

---

### Issue #4: Global Loader Shows on Every Navigation

**Priority:** 🔴 CRITICAL
**Location:** `src/components/shared/GlobalLoader.astro`
**Files to Modify:** `src/components/shared/GlobalLoader.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- Loader appears on initial page load (expected behavior)
- Loader ALSO appears on every client-side navigation via `astro:page-load` event (line 53-60)
- This creates annoying UX - users see loading screen even for fast page transitions
- Astro's View Transitions API makes navigation instant, but loader still shows
- Users may think site is slow or broken
- Creates unnecessary visual interruption during navigation

**Acceptance Criteria:**

- [x] Loader shows ONLY on initial page load (first visit)
- [x] Loader does NOT show on client-side navigation (`astro:page-load` events)
- [x] Loader does NOT show when clicking internal links
- [x] Loader still shows on browser refresh/reload
- [x] Visual verification: Navigate between pages - loader should not appear after first load

**Implementation Notes:**

**Approach:** Removed the `astro:page-load` event handler that was showing the loader on every navigation.

**Know How:**
- Removed the `document.addEventListener('astro:page-load', ...)` block that was re-showing the loader
- Added `isInitialLoad` flag to track if this is the first page load
- Only call `hideLoader()` on initial page load
- Loader still shows on browser refresh/reload because those trigger the `load` event

**Know Why:**
- Astro View Transitions provide instant navigation - no loading state is needed
- Showing loader on every navigation creates a poor UX and makes the site feel slow
- The loader should only appear on the very first visit to give users feedback that the site is loading
- Browser refresh/reload still needs the loader because those are full page loads, not client-side navigation
- Using a flag ensures the loader only hides once, preventing it from showing again

---

### Issue #5: Missing Custom 404 Page

**Priority:** 🔴 CRITICAL
**Location:** Site-wide error handling
**Files to Create:** `src/pages/404.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- No custom 404 page exists in the codebase
- Astro shows generic default 404 page when users hit broken links
- Generic 404 doesn't match site design (dark theme, terminal aesthetic)
- No helpful navigation or suggestions for users
- Poor UX when users mistype URLs or follow broken links
- Browser testing confirmed: Invalid blog post URL shows generic Astro 404

**Acceptance Criteria:**

- [x] Custom 404 page exists at `src/pages/404.astro`
- [x] 404 page matches site design (dark theme, consistent styling)
- [x] 404 page includes helpful message ("Page not found" or similar)
- [x] 404 page includes navigation links (Back to Home, Blog, etc.)
- [x] 404 page is accessible and keyboard navigable
- [x] Visual verification: Visit `/blog/nonexistent-post` - custom 404 appears (not Astro default)

**Implementation Notes:**

**Approach:** Created a custom 404 page that matches the site's design system and provides helpful navigation.

**Know How:**
- Created `src/pages/404.astro` file (Astro automatically uses this for 404 errors)
- Used the same Layout, Header, Footer, and Container components for consistency
- Added Tux penguin ASCII art to match the terminal aesthetic
- Included clear error message and helpful navigation buttons
- Added quick links section with Blog, Guides, Code Library
- Used existing Button component and design tokens (colors, spacing)

**Know Why:**
- Astro automatically routes `404.astro` to handle all 404 errors
- Maintaining design consistency (dark theme, terminal aesthetic) prevents jarring user experience
- Providing navigation options helps users find content instead of leaving the site
- ASCII art maintains the playful, developer-focused brand identity
- Using existing components ensures the 404 page doesn't break if design system changes

---

## 🟠 HIGH PRIORITY - Phase 2 (Do This Week)

### Issue #6: No Active Navigation State

**Priority:** 🟠 HIGH
**Location:** `src/components/layout/Header.astro` (all pages)
**Files to Modify:** `src/components/layout/Header.astro`
**Status:** ✅ COMPLETED (Implemented alongside Issue #2)

**Issue Detail:**

- Current page is not visually indicated in navigation
- All nav items look the same regardless of current page
- Users cannot tell which section they're viewing
- Poor navigation UX - users lose context
- Basic navigation requirement that most sites have

**Acceptance Criteria:**

- [x] Current page nav item has distinct styling (different color, underline, or background)
- [x] Active state is determined by `Astro.url.pathname`
- [x] Active state works for all routes (/blog, /guides, /code, /)
- [x] Active state is visible and clear to users
- [x] Visual verification: Navigate to /blog - "Blog" nav item should be highlighted

**Implementation Notes:**

**Approach:** Added active state detection using `Astro.url.pathname` and conditional styling.

**Know How:**
- Used `Astro.url.pathname` in the Header component to get current route
- Checked if `currentPath === item.href` or if path starts with item href (for nested routes)
- Applied conditional classes: `text-accent-blue border-b-2 border-accent-blue` for active state
- Applied to both desktop and mobile navigation menus

**Know Why:**
- Active state helps users understand where they are in the site hierarchy
- Using `pathname.startsWith()` handles nested routes (e.g., `/blog/some-post` should highlight Blog)
- Border-bottom is a common, non-intrusive way to indicate active state
- Consistent styling across desktop and mobile ensures good UX on all devices

---

### Issue #7: Search Term Not Shown in Active Filters

**Priority:** 🟠 HIGH
**Location:** `src/components/blog/FilterBar.astro`
**Files to Modify:** `src/components/blog/FilterBar.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- When searching for text (e.g., "docker"), search term appears in input field
- Search term is NOT listed under "Active filters:" section
- Only tag filters are shown in active filters
- Users don't see what they're filtering by in the active filters display
- Confusing UX - users may forget what they searched for
- Browser testing confirmed: Search for "docker" - term not shown in active filters

**Acceptance Criteria:**

- [x] Search query appears in "Active filters:" section when search input has value
- [x] Search term displayed as removable badge (similar to tag filters)
- [x] Clicking X on search badge clears search and removes it from active filters
- [x] Search badge shows the actual search text
- [x] Visual verification: Type "docker" in search - "docker" appears in active filters section

**Implementation Notes:**

**Approach:** Extended `updateActiveTagsDisplay()` function to also show search query as a removable badge.

**Know How:**
- Modified `updateActiveTagsDisplay()` to check if `searchQuery.trim().length > 0`
- Created search badge element with same styling as tag badges
- Added search badge before tag badges in the display
- Search badge includes "Search: " prefix and the actual query text
- Clicking search badge clears search input and updates display
- Updated search input handler to call `updateActiveTagsDisplay()` when value changes

**Know Why:**
- Users need visual feedback about all active filters, not just tags
- Consistent badge UI (same styling as tags) creates familiar interaction pattern
- Showing search term helps users remember what they searched for
- Making it removable provides quick way to clear search without clearing tags
- Updating display on input change provides immediate feedback

---

### Issue #8: No Empty State for Filtered Results

**Priority:** 🟠 HIGH
**Location:** `src/components/blog/FilterBar.astro`, `src/components/blog/PostList.astro`
**Files to Modify:** `src/components/blog/FilterBar.astro` or `PostList.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- When filters return zero results, no message is displayed
- Post list simply shows nothing (empty container)
- Users don't know why nothing appears
- Confusing UX - users may think site is broken or content is loading
- No way to understand what filters are causing empty results

**Acceptance Criteria:**

- [x] When filtered results are empty, display "No posts found" message
- [x] Message includes context (e.g., "No posts match your filters")
- [x] "Clear filters" button is prominently displayed in empty state
- [x] Empty state is visually distinct and helpful
- [x] Visual verification: Apply filters that return 0 results - empty state message appears

**Implementation Notes:**

**Approach:** Added empty state element to blog index page and show/hide logic in FilterBar.

**Know How:**
- Added `<div id="empty-state">` element in `src/pages/blog/index.astro` after PostList
- Initially hidden with `hidden` class
- Empty state includes helpful message and "Clear all filters" button
- In `filterAndSort()` function, check if `filtered.length === 0 && postsData.length > 0`
- Show empty state when condition is true, hide otherwise
- Connected empty state's clear button to same `clearAllFilters()` function

**Know Why:**
- Empty states are crucial UX - users need to understand why no content appears
- Providing clear action (clear filters) helps users recover from over-filtering
- Checking `postsData.length > 0` ensures we don't show empty state when page is actually empty
- Reusing clear filters function maintains consistency with filter bar's clear button
- Centered, prominent display ensures users notice the empty state

---

### Issue #9: Search Input Lacks Debouncing

**Priority:** 🟠 HIGH
**Location:** `src/components/blog/FilterBar.astro`
**Files to Modify:** `src/components/blog/FilterBar.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- Search triggers on every keystroke (line 212-215)
- No delay between typing and filtering
- Performance issues with many posts - filters run on every character
- Janky UI - posts may flicker or jump as user types
- Browser testing confirmed: Typing "docker" triggers immediate filtering on each keystroke

**Acceptance Criteria:**

- [x] Search input has 300ms debounce delay
- [x] Filtering only occurs after user stops typing for 300ms
- [x] No performance issues when typing quickly
- [x] UI remains smooth during typing
- [x] Visual verification: Type quickly - filtering should wait until typing stops

**Implementation Notes:**

**Approach:** Implemented debouncing using `setTimeout` with cleanup on new input.

**Know How:**
- Added `searchTimeout` variable to store timeout ID
- On input event, clear previous timeout if it exists
- Set new timeout with 300ms delay before calling filter function
- Store timeout ID so it can be cleared on next keystroke
- Clear timeout in `clearAllFilters()` function to prevent stale filters

**Know Why:**
- Debouncing reduces unnecessary filter operations - only filters when user pauses typing
- 300ms is standard debounce delay - long enough to catch typing pauses, short enough to feel responsive
- Clearing previous timeout ensures only the last keystroke triggers filtering
- Improves performance with large post lists by reducing filter operations
- Prevents UI jank from rapid DOM updates during typing

---

### Issue #10: Terminal Animation Too Long

**Priority:** 🟠 HIGH
**Location:** `src/pages/index.astro`, `src/components/landing/TerminalHero.astro`
**Files to Modify:** `src/pages/index.astro`, `src/components/landing/TerminalHero.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- Terminal animation takes 10-15 seconds before content appears
- No skip button available
- Users may think site is broken or loading
- High bounce rate - users leave before seeing content
- First impression issue - affects homepage engagement

**Acceptance Criteria:**

- [x] "Skip animation" button is visible during terminal animation
- [x] Clicking skip button immediately shows content
- [x] Animation duration is reduced (optional alternative)
- [x] Skip button is accessible via keyboard
- [x] Visual verification: Homepage loads - skip button appears and works

**Implementation Notes:**

**Approach:** Added skip button that immediately completes the animation sequence.

**Know How:**
- Added skip button positioned absolutely in top-right corner of terminal wrapper
- Button styled to match site design (dark theme, border, hover states)
- Created `skipAnimation()` function that:
  - Immediately shows fastfetch container
  - Hides terminal output and prompt
  - Calls `shrinkTerminal()` to complete animation
- Added click and keyboard (Enter/Space) event handlers
- Hide skip button when animation completes naturally
- Button has proper ARIA label and focus styles for accessibility

**Know Why:**
- Users should have control over their experience - not forced to wait
- Skip button gives users choice without removing the engaging animation
- Immediate completion (showing fastfetch and shrinking) provides instant feedback
- Keyboard accessibility ensures all users can skip, not just mouse users
- Hiding button after completion prevents confusion when animation is done

---

### Issue #11: Content Below Terminal Starts Hidden

**Priority:** 🟠 HIGH
**Location:** `src/pages/index.astro`
**Files to Modify:** `src/pages/index.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- Featured/Latest sections have `opacity-0` initially
- Content is invisible but still takes up space in layout
- May cause Cumulative Layout Shift (CLS) issues
- Poor Core Web Vitals score
- Content may flash or shift when becoming visible

**Acceptance Criteria:**

- [x] Content visibility managed without `opacity-0` causing layout shift
- [x] Use `hidden` class or height-based approach instead
- [x] No CLS (Cumulative Layout Shift) in Lighthouse
- [x] Content appears smoothly without layout jumps
- [x] Visual verification: Check Lighthouse CLS score - should be < 0.1

**Implementation Notes:**

**Approach:** Changed from `opacity-0` to `hidden` class to prevent layout shift.

**Know How:**
- Changed `class="opacity-0"` to `class="hidden opacity-0"` on content-below-terminal div
- `hidden` class uses `display: none`, which removes element from layout flow
- When showing content, remove both `hidden` and `opacity-0`, add `opacity-100`
- Updated `shrinkTerminal()` function to remove `hidden` class when showing content

**Know Why:**
- `opacity-0` keeps element in layout (takes up space) but invisible - causes CLS
- `display: none` removes element from layout flow - no space taken, no CLS
- Using both initially (`hidden opacity-0`) then removing `hidden` and adding `opacity-100` provides smooth fade-in without layout shift
- CLS is a Core Web Vitals metric - Google uses it for SEO ranking
- Better CLS score improves user experience and search rankings

---

### Issue #12: Placeholder Social Links

**Priority:** 🟠 HIGH
**Location:** `src/components/layout/Footer.astro`
**Files to Modify:** `src/components/layout/Footer.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- Links point to generic domains (github.com, linkedin.com, twitter.com)
- Not actual profile URLs - just domain root
- Broken links - clicking goes to generic site pages
- Unprofessional appearance
- Easy fix but looks unprofessional

**Acceptance Criteria:**

- [x] Social links either removed OR updated with actual profile URLs
- [x] If removed, links are completely removed from footer
- [x] If updated, links point to actual social media profiles
- [x] Visual verification: Click social links - either 404 (if removed) or go to profiles

**Implementation Notes:**

**Approach:** Removed placeholder social links since actual profile URLs are not available.

**Know How:**
- Removed the entire `<div class="flex gap-4">` section containing GitHub, LinkedIn, and Twitter links
- Kept RSS link as it's functional (Issue #13)
- Footer now shows copyright and RSS link only

**Know Why:**
- Placeholder links create poor UX - users expect links to work
- Removing broken links is better than keeping non-functional ones
- Can easily add back when actual profile URLs are available
- RSS link remains as it provides value (blog feed subscription)

---

### Issue #13: RSS Link May Not Exist

**Priority:** 🟠 HIGH
**Location:** `src/components/layout/Footer.astro`
**Files to Modify:** `src/components/layout/Footer.astro` or create `src/pages/rss.xml.ts`
**Status:** ✅ COMPLETED

**Issue Detail:**

- RSS link points to `/rss.xml` but may not be generated
- Link exists in footer but route may not exist
- Broken link if RSS feed doesn't exist
- Users clicking RSS get 404 error

**Acceptance Criteria:**

- [x] Either: RSS feed is generated at `/rss.xml` and works
- [x] Or: RSS link is removed from footer
- [x] Visual verification: Click RSS link - either feed loads or link is removed

**Implementation Notes:**

**Approach:** Created RSS feed generator using Astro's API route system.

**Know How:**
- Created `src/pages/rss.xml.ts` file (Astro treats `.ts` files in pages as API routes)
- Used `APIRoute` type from Astro for type safety
- Fetched all non-draft blog posts using `getCollection('blog')`
- Sorted posts by date (newest first)
- Generated RSS 2.0 XML format with:
  - Channel metadata (title, link, description, language)
  - Atom self-link for feed discovery
  - Item elements for each post (title, link, guid, description, pubDate, categories)
- Used `site.href` from Astro context for base URL
- Returned Response with `application/xml` content type
- Used CDATA sections for content that might contain HTML/special characters

**Know Why:**
- RSS feeds are standard for blogs - users expect them
- Astro's API routes are perfect for dynamic content like RSS feeds
- RSS 2.0 is widely supported by feed readers
- Using `site.href` ensures correct URLs in production
- CDATA prevents XML parsing errors from special characters in post titles/excerpts
- Including categories (tags) helps feed readers organize content

---

## 🟡 MEDIUM PRIORITY - Phase 3 (Do Next)

### Issue #14: No Reading Progress Indicator

**Priority:** 🟡 MEDIUM
**Location:** Blog post and guide pages
**Files to Modify:** `src/pages/blog/[slug].astro`, guide pages
**Status:** ⏳ PENDING

**Issue Detail:**

- No visual indicator of reading progress
- Users can't gauge article length or how much is left
- Nice UX enhancement for long articles
- Common feature on modern blog sites

**Acceptance Criteria:**

- [ ] Progress bar appears at top of page (thin bar)
- [ ] Bar fills as user scrolls through article
- [ ] Progress calculated: scroll position / article height
- [ ] Bar is visible but not intrusive
- [ ] Visual verification: Scroll through blog post - progress bar updates

---

### Issue #15: Tags Duplicated in Blog Post Footer

**Priority:** 🟡 MEDIUM
**Location:** `src/pages/blog/[slug].astro`
**Files to Modify:** `src/pages/blog/[slug].astro`
**Status:** ✅ COMPLETED

**Issue Detail:**

- Tags shown in both header (line 60-64) and footer (line 70-74)
- Redundant information display
- Footer tags are not clickable to filter
- Minor redundancy issue

**Acceptance Criteria:**

- [x] Either: Tags removed from footer (keep header only)
- [x] Or: Footer tags are clickable and filter posts
- [x] No duplicate tag display
- [x] Visual verification: Blog post shows tags only once OR footer tags are functional

**Implementation Notes:**

**Approach:** Removed duplicate tags from footer, keeping only header tags which are more prominent and clickable.

**Know How:**
- Removed the tag display section from the footer
- Kept tags only in the header where they're more visible
- Footer now only contains the "Back to Blog" button

**Know Why:**
- Tags in header are more prominent and provide better UX
- Removing footer tags reduces redundancy and visual clutter
- Header tags are already clickable and functional for filtering
- Cleaner, more focused footer design

---

### Issue #16: No Related Posts

**Priority:** 🟡 MEDIUM
**Location:** `src/pages/blog/[slug].astro`
**Files to Modify:** `src/pages/blog/[slug].astro`
**Status:** ⏳ PENDING

**Issue Detail:**

- No suggestions for related content after reading post
- Users leave after one post - lower engagement
- Related posts based on shared tags would increase engagement
- Common feature on blog sites

**Acceptance Criteria:**

- [ ] "Related Posts" section appears below article
- [ ] Shows 3-4 related posts based on shared tags
- [ ] Posts sorted by number of shared tags
- [ ] Related posts are clickable and navigate correctly
- [ ] Visual verification: Blog post shows related posts section with 3-4 posts

---

### Issue #17: No Table of Contents

**Priority:** 🟡 MEDIUM
**Location:** Blog post and guide pages
**Files to Modify:** `src/pages/blog/[slug].astro`, guide pages
**Status:** ⏳ PENDING

**Issue Detail:**

- Long articles lack navigation structure
- Hard to navigate long content
- No way to jump to specific sections
- TOC helps users understand article structure

**Acceptance Criteria:**

- [ ] TOC auto-generated from headings (h2, h3)
- [ ] TOC displayed as sidebar or top section
- [ ] TOC items are clickable anchor links
- [ ] TOC updates based on article headings
- [ ] Visual verification: Long blog post shows TOC with clickable headings

---

### Issue #18: Guide Navigation Layout Cramped on Mobile

**Priority:** 🟡 MEDIUM
**Location:** `src/pages/guides/[guideSlug]/[partSlug].astro`
**Files to Modify:** Guide part pages
**Status:** ⏳ PENDING

**Issue Detail:**

- 3-column grid becomes cramped on mobile
- Sidebar, content, and navigation all compete for space
- Poor mobile reading experience
- Needs responsive layout adjustment

**Acceptance Criteria:**

- [ ] On mobile (< 768px), sidebar stacks below content
- [ ] Layout changes from 3-column to single column on mobile
- [ ] Content is readable on mobile
- [ ] Visual verification: Guide part page on 375px - layout stacks properly

---

### Issue #19: No Code Library Search/Filter

**Priority:** 🟡 MEDIUM
**Location:** `src/pages/code/index.astro`
**Files to Modify:** `src/pages/code/index.astro`
**Status:** ⏳ PENDING

**Issue Detail:**

- No way to filter scripts by language
- No search functionality
- Hard to find specific scripts as library grows
- Scalability issue - will become more important over time

**Acceptance Criteria:**

- [ ] Search input added to code library page
- [ ] Language filter dropdown added
- [ ] Filtering logic implemented (similar to blog page)
- [ ] Scripts filter based on search and language
- [ ] Visual verification: Code library page has search and language filter

---

### Issue #20: No Share Buttons

**Priority:** 🟡 MEDIUM
**Location:** Blog post and guide pages
**Files to Modify:** `src/pages/blog/[slug].astro`, guide pages
**Status:** ⏳ PENDING

**Issue Detail:**

- No way to share content
- Lower social engagement
- Users can't easily share articles
- Common feature on blog sites

**Acceptance Criteria:**

- [ ] Share buttons added (Twitter, LinkedIn, copy link)
- [ ] Buttons displayed in article header or footer
- [ ] Share buttons work correctly
- [ ] Copy link button provides feedback when clicked
- [ ] Visual verification: Blog post shows share buttons that work

---

## 🟢 LOW PRIORITY - Phase 4 (Polish & Nice to Have)

### Issue #21: No Focus Visible States

**Priority:** 🟢 LOW
**Location:** Site-wide
**Files to Modify:** `src/styles/global.css` or component files
**Status:** ⏳ PENDING

**Issue Detail:**

- Keyboard navigation lacks visible focus indicators
- Poor accessibility for keyboard users
- Users can't see where focus is when using Tab key
- WCAG accessibility requirement

**Acceptance Criteria:**

- [ ] All interactive elements have `focus-visible` styles
- [ ] Focus rings are visible and use accent colors
- [ ] Keyboard navigation is clear
- [ ] Visual verification: Tab through site - focus indicators visible

---

### Issue #22: No Skip to Content Link

**Priority:** 🟢 LOW
**Location:** Site-wide
**Files to Modify:** `src/layouts/Layout.astro`
**Status:** ⏳ PENDING

**Issue Detail:**

- No way to skip navigation for screen readers
- Screen reader users must navigate through nav on every page
- Accessibility improvement
- WCAG best practice

**Acceptance Criteria:**

- [ ] Skip link appears at top of page (hidden until focused)
- [ ] Link jumps to main content area
- [ ] Link is keyboard accessible
- [ ] Visual verification: Tab on page load - skip link appears and works

---

### Issue #23: Featured/Latest May Overlap

**Priority:** 🟢 LOW
**Location:** `src/pages/index.astro`
**Files to Modify:** `src/pages/index.astro`
**Status:** ⏳ PENDING

**Issue Detail:**

- Featured posts may also appear in Latest section
- Confusing, redundant content
- Users see same post twice
- Content logic issue

**Acceptance Criteria:**

- [ ] Featured posts excluded from Latest section
- [ ] OR clearly labeled if intentional overlap
- [ ] No confusing duplicate content
- [ ] Visual verification: Homepage - featured posts don't appear in latest

---

### Issue #24: Add Keyboard Shortcuts

**Priority:** 🟢 LOW
**Location:** `src/components/blog/FilterBar.astro`
**Files to Modify:** `src/components/blog/FilterBar.astro`
**Status:** ⏳ PENDING

**Issue Detail:**

- No keyboard shortcuts for common actions
- Power users can't navigate efficiently
- Nice-to-have feature for advanced users

**Acceptance Criteria:**

- [ ] `/` key focuses search input
- [ ] `Esc` key clears filters
- [ ] Shortcuts work when on blog page
- [ ] Visual verification: Press `/` on blog page - search focuses

---

### Issue #25: No Print Styles

**Priority:** 🟢 LOW
**Location:** Site-wide
**Files to Modify:** `src/styles/global.css`
**Status:** ⏳ PENDING

**Issue Detail:**

- Pages not optimized for printing
- Poor experience when printing articles
- Navigation and footer print unnecessarily

**Acceptance Criteria:**

- [ ] Print media queries added (`@media print`)
- [ ] Navigation and footer hidden when printing
- [ ] Typography optimized for printing
- [ ] Visual verification: Print preview - only content prints, no nav/footer

---

### Issue #26: Tag Click Handler May Fail

**Priority:** 🟢 LOW
**Location:** `src/components/blog/TagPill.astro`
**Files to Modify:** `src/components/blog/TagPill.astro`
**Status:** ⏳ PENDING

**Issue Detail:**

- Tag click handler depends on FilterBar being loaded
- May fail silently if FilterBar not ready
- Tags appear clickable but don't work
- Edge case but affects reliability

**Acceptance Criteria:**

- [ ] Error handling added for FilterBar dependency
- [ ] Fallback to URL navigation if FilterBar not loaded
- [ ] Tags always work (either filter or navigate)
- [ ] Visual verification: Click tags - always works even if FilterBar slow

---

### Issue #27: No Loading Skeletons

**Priority:** 🟢 LOW
**Location:** Blog list, guides list
**Files to Modify:** List components
**Status:** ✅ COMPLETED

**Issue Detail:**

- Content appears suddenly without loading state
- Perceived performance issues
- Users may think content is broken

**Acceptance Criteria:**

- [x] Skeleton loader components created
- [x] Skeletons show during content load
- [x] Smooth transition from skeleton to content
- [x] Visual verification: Page load - skeletons appear then content loads

**Implementation Notes:**

**Approach:** Created reusable skeleton components and added smooth fade transitions during page loads and navigation.

**Know How:**
- Created `SkeletonCard.astro` component for individual card skeletons with configurable content lines
- Created `SkeletonList.astro` component for list skeletons with configurable count and card lines
- Added skeleton containers to blog index, guides index, and homepage (Featured/Latest sections)
- Implemented fade-in/fade-out transitions using opacity classes and CSS transitions
- Skeletons show initially (300ms delay) then fade to actual content
- Added support for Astro View Transitions - skeletons show during navigation then fade to content
- Used `pointer-events-none` to prevent skeleton interaction during transitions
- Homepage skeletons trigger when content below terminal becomes visible (watches for `hidden` class removal)

**Know Why:**
- Loading skeletons improve perceived performance - users see content structure immediately
- Smooth transitions prevent jarring content swaps
- Reusable components maintain consistency across pages
- Short delay (200-400ms) gives visual feedback without feeling slow
- Supporting View Transitions ensures skeletons work during client-side navigation
- Pointer events disabled during transition prevents accidental clicks on invisible content
- Homepage integration with terminal animation ensures skeletons appear at the right time

---

## Implementation Notes

- **Tailwind Typography**: Use `@tailwindcss/typography` v0.1.x for Tailwind v4 compatibility
- **Mobile Menu**: Use CSS transitions and JavaScript for smooth open/close
- **Active Nav State**: Use `Astro.url.pathname` in Header component
- **Debouncing**: Implement with `setTimeout` and cleanup
- **Empty States**: Check `filtered.length === 0` in filter logic
- **Related Posts**: Sort by number of shared tags, limit to 4 results

## Testing Checklist

After each phase:

- [ ] Test on mobile devices (375px viewport)
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Verify all links work
- [ ] Check console for errors
- [ ] Test filter/search functionality
- [ ] Verify prose styles render correctly
- [ ] Run Lighthouse audit for performance/accessibility

## Browser Testing Improvements (Additional Issues Found)

### Issue #28: Blog Post Content Not Rendering

**Priority:** 🔴 CRITICAL
**Location:** `src/pages/blog/[slug].astro`
**Status:** ✅ COMPLETED

**Issue Detail:**
- Blog post content was not displaying - only showing `[object Object]` placeholder
- `{await post.render()}` was being used incorrectly
- Content was completely missing from blog posts

**Implementation Notes:**

**Approach:** Fixed by properly destructuring the `Content` component from the render result.

**Know How:**
- Changed from `{await post.render()}` to `const { Content } = await post.render();` then using `<Content />`
- In Astro, `post.render()` returns a `RenderResult` object with a `Content` component property
- The Content component must be destructured and used as a component, not as a direct render result

**Know Why:**
- Astro's content collections API requires accessing the `Content` component from the render result
- Using `{await post.render()}` directly tries to render the object itself, not the content
- This is the correct pattern for Astro 3+ content collections

---

### Issue #29: Empty State Logic Bug

**Priority:** 🟠 HIGH
**Location:** `src/components/blog/FilterBar.astro`
**Status:** ✅ COMPLETED

**Issue Detail:**
- Empty state message was showing even when posts were visible
- Logic was checking `filtered.length === 0` but not properly handling the case when posts exist

**Implementation Notes:**

**Approach:** Improved the conditional logic to be more explicit and clear.

**Know How:**
- Changed condition from `if (filtered.length === 0 && postsData.length > 0)` to explicit boolean checks
- Used `const hasPosts = postsData.length > 0;` and `const hasFilteredResults = filtered.length > 0;`
- Only show empty state when `hasPosts && !hasFilteredResults`

**Know Why:**
- More explicit boolean variables make the logic clearer and easier to debug
- Prevents edge cases where empty state might show incorrectly
- Better separation of concerns - checks if posts exist separately from filter results

---

### Issue #30: Duplicate Tags in Blog Post Footer

**Priority:** 🟡 MEDIUM
**Location:** `src/pages/blog/[slug].astro`
**Status:** ✅ COMPLETED

**Issue Detail:**
- Tags were displayed twice - once in header and once in footer
- Footer tags were not clickable (unlike header tags)
- Redundant information display

**Implementation Notes:**

**Approach:** Removed duplicate tags from footer, keeping only header tags.

**Know How:**
- Removed the tag display section from the footer (lines 70-74)
- Kept tags only in the header where they're more prominent and clickable
- Footer now only contains the "Back to Blog" button

**Know Why:**
- Tags in header are more visible and provide better UX
- Removing footer tags reduces redundancy and clutter
- Header tags are already clickable and functional for filtering
- Cleaner, more focused footer design

---

## Progress Summary

**Completed:**
- ✅ All 5 CRITICAL issues (Phase 1)
- ✅ All 8 HIGH priority issues (Phase 2)
- ✅ 3 Browser testing improvements (Issues #28-30)

**Remaining:**
- ⏳ 7 MEDIUM priority issues (Phase 3)
- ⏳ 7 LOW priority issues (Phase 4)

**Total Progress:** 16/30 issues completed (53%)

