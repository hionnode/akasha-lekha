const CHECK_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

const RESET_DELAY_MS = 2000;

/**
 * Wire a copy button so that clicking it copies `getText(button)` to the
 * clipboard, swaps the button content for a check icon, adds a `copied`
 * class, and resets after 2s. The original innerHTML is captured per click
 * so callers can render any starting icon (16x16 default).
 */
export function attachCopyButton(button: Element, getText: (button: Element) => string | null) {
  button.addEventListener('click', async (e) => {
    e.stopPropagation();
    const text = getText(button);
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      const originalHTML = button.innerHTML;
      button.innerHTML = CHECK_ICON_SVG;
      button.classList.add('copied');

      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('copied');
      }, RESET_DELAY_MS);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });
}

/**
 * Wire every element matching `selector` with `attachCopyButton`. Idempotent
 * via a `data-copy-bound` flag, safe to call across astro:page-load events.
 */
export function attachCopyButtons(selector: string, getText: (button: Element) => string | null) {
  document.querySelectorAll(selector).forEach((button) => {
    if (button.hasAttribute('data-copy-bound')) return;
    button.setAttribute('data-copy-bound', '');
    attachCopyButton(button, getText);
  });
}
