import type { ContentItem, ContentType, TUIData } from '../../utils/tuiHelpers';
import { filterContent, getVimKey } from '../../utils/tuiHelpers';

interface TUIState {
  mode: 'vim' | 'arrows';
  contentType: ContentType | 'all';
  selectedIndex: number;
  activeTags: string[];
  searchQuery: string;
  filteredItems: ContentItem[];
  currentItem: ContentItem | null;
}

export default class TUIController {
  private state: TUIState;
  private data: TUIData;
  private searchMode: boolean = false;
  private tagFilterMode: boolean = false;

  constructor(dataStr: string) {
    this.data = JSON.parse(dataStr);
    const savedMode = localStorage.getItem('tui-navigation-mode') || 'arrows';

    this.state = {
      mode: savedMode === 'vim' || savedMode === 'arrows' ? savedMode : 'arrows',
      contentType: 'all',
      selectedIndex: 0,
      activeTags: [],
      searchQuery: '',
      filteredItems: [],
      currentItem: null,
    };

    this.initialize();
  }

  private initialize() {
    // Update filtered items
    this.updateFilteredItems();

    // Set up keyboard listeners
    this.setupKeyboardListeners();

    // Listen for events from other components
    this.setupEventListeners();

    // Initialize UI
    this.updateUI();

    // Send tag data to tag filter
    const tags = Object.entries(this.data.allTags || {}).sort(
      (a, b) => (b[1] as number) - (a[1] as number)
    );
    window.dispatchEvent(new CustomEvent('tag-data-update', { detail: { tags } }));
  }

  private setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
      // Don't handle keys when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Handle special keys
      if (e.key === '/') {
        e.preventDefault();
        this.activateSearch();
        return;
      }

      if (e.key === 't' && !this.searchMode) {
        e.preventDefault();
        this.activateTagFilter();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (this.searchMode) {
          this.deactivateSearch();
        } else if (this.tagFilterMode) {
          this.deactivateTagFilter();
        } else {
          this.clearFilters();
        }
        return;
      }

      if (e.key === 'q') {
        e.preventDefault();
        // Optionally navigate away or show quit confirmation
        return;
      }

      // Navigation keys
      if (this.searchMode || this.tagFilterMode) {
        return; // Don't handle navigation in search/tag mode
      }

      let handled = false;

      // Vim mode
      if (this.state.mode === 'vim') {
        const arrowKey = getVimKey(e.key);
        if (arrowKey) {
          e.preventDefault();
          handled = true;
          if (arrowKey === 'ArrowUp' || arrowKey === 'ArrowDown') {
            this.navigateList(arrowKey === 'ArrowDown' ? 1 : -1);
          }
        }
      }

      // Arrow keys (both modes)
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        handled = true;
        this.navigateList(e.key === 'ArrowDown' ? 1 : -1);
      }

      if (e.key === 'Enter' && !handled) {
        e.preventDefault();
        this.openCurrentItem();
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        // Could switch between panels in future
      }
    });
  }

  private setupEventListeners() {
    // Content type change
    window.addEventListener('content-type-change', ((e: CustomEvent) => {
      this.state.contentType = e.detail.type as ContentType | 'all';
      this.state.selectedIndex = 0;
      this.updateFilteredItems();
      this.updateUI();
    }) as EventListener);

    // Tag toggle
    window.addEventListener('tag-toggle', ((e: CustomEvent) => {
      const { tag, active } = e.detail;
      if (active) {
        if (!this.state.activeTags.includes(tag)) {
          this.state.activeTags.push(tag);
        }
      } else {
        this.state.activeTags = this.state.activeTags.filter((t) => t !== tag);
      }
      this.state.selectedIndex = 0;
      this.updateFilteredItems();
      this.updateUI();
    }) as EventListener);

    // Tags apply (from tag filter overlay)
    window.addEventListener('tags-apply', ((e: CustomEvent) => {
      this.state.activeTags = e.detail.tags;
      this.state.selectedIndex = 0;
      this.updateFilteredItems();
      this.updateUI();
    }) as EventListener);

    // Search update
    window.addEventListener('search-update', ((e: CustomEvent) => {
      this.state.searchQuery = e.detail.query || '';
      this.state.selectedIndex = 0;
      this.updateFilteredItems();
      this.updateUI();
    }) as EventListener);

    // List item select
    window.addEventListener('list-item-select', ((e: CustomEvent) => {
      this.state.selectedIndex = e.detail.index;
      this.updateCurrentItem();
      this.updateUI();
    }) as EventListener);
  }

  private updateFilteredItems() {
    this.state.filteredItems = filterContent(
      this.data,
      this.state.contentType,
      this.state.activeTags,
      this.state.searchQuery
    );

    // Clamp selected index
    if (this.state.selectedIndex >= this.state.filteredItems.length) {
      this.state.selectedIndex = Math.max(0, this.state.filteredItems.length - 1);
    }

    this.updateCurrentItem();
  }

  private updateCurrentItem() {
    if (
      this.state.filteredItems.length > 0 &&
      this.state.selectedIndex >= 0 &&
      this.state.selectedIndex < this.state.filteredItems.length
    ) {
      this.state.currentItem = this.state.filteredItems[this.state.selectedIndex];
    } else {
      this.state.currentItem = null;
    }
  }

  private navigateList(direction: number) {
    const newIndex = this.state.selectedIndex + direction;
    if (newIndex >= 0 && newIndex < this.state.filteredItems.length) {
      this.state.selectedIndex = newIndex;
      this.updateCurrentItem();
      this.updateUI();
    }
  }

  private openCurrentItem() {
    if (!this.state.currentItem) return;

    const typePaths: Record<string, string> = {
      blog: '/blog',
      guides: '/guides',
      code: '/code',
    };

    const path = typePaths[this.state.currentItem.type] || '';
    const fullPath =
      this.state.currentItem.type === 'guides'
        ? `${path}/${this.state.currentItem.slug.split('/')[0]}`
        : `${path}/${this.state.currentItem.slug}`;

    window.location.href = fullPath;
  }

  private activateSearch() {
    this.searchMode = true;
    window.dispatchEvent(new CustomEvent('search-activate'));
  }

  private deactivateSearch() {
    this.searchMode = false;
    // Search overlay handles its own hiding
    // Keep search query when closing overlay
  }

  private activateTagFilter() {
    this.tagFilterMode = true;
    window.dispatchEvent(new CustomEvent('tag-filter-activate'));
  }

  private deactivateTagFilter() {
    this.tagFilterMode = false;
    // Tag filter overlay handles its own hiding
    // Don't clear tags on escape, just close the overlay
  }

  private clearFilters() {
    this.state.searchQuery = '';
    this.state.activeTags = [];
    this.state.selectedIndex = 0;
    this.updateFilteredItems();
    this.updateUI();
  }

  private updateUI() {
    // Update status bar
    if ((window as any).updateStatusBar) {
      (window as any).updateStatusBar({
        mode: this.state.mode,
        searchQuery: this.state.searchQuery,
        activeTags: this.state.activeTags,
        contentType: this.state.contentType,
        itemCount: this.state.filteredItems.length,
      });
    }

    // Update content list
    window.dispatchEvent(
      new CustomEvent('content-list-update', {
        detail: {
          items: this.state.filteredItems,
          selectedIndex: this.state.selectedIndex,
        },
      })
    );

    // Update content viewer
    window.dispatchEvent(
      new CustomEvent('content-select', {
        detail: { item: this.state.currentItem },
      })
    );

    // Update instructions
    window.dispatchEvent(
      new CustomEvent('navigation-mode-change', {
        detail: { mode: this.state.mode },
      })
    );
  }
}

// Export initialization function
export function initializeTUI(dataStr: string) {
  return new TUIController(dataStr);
}
