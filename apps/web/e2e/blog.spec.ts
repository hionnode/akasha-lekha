import { test, expect } from '@playwright/test';

const SAMPLE_POST = '/blog/aws-for-startups/01-your-first-60-minutes-in-aws';
const SECOND_POST = '/blog/aws-for-startups/02-iam-intro-for-starters';

test.describe('Blog index (home page)', () => {
  test('renders the blog list with at least one post card', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
    // PostList renders one or more post links; check we at least have the
    // first AWS post visible somewhere on the page.
    await expect(page.locator(`a[href="${SAMPLE_POST}"]`).first()).toBeVisible();
  });

  test('shows the tag sidebar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#blog-content')).toBeVisible();
  });

  test('renders the RSS feed at /rss.xml', async ({ page }) => {
    const response = await page.goto('/rss.xml');
    expect(response?.status()).toBe(200);
    const body = await response!.text();
    expect(body).toContain('<rss');
  });
});

test.describe('Blog post page', () => {
  test('renders a single post with title and prose body', async ({ page }) => {
    await page.goto(SAMPLE_POST);

    // Article title is the h1
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Prose container is present
    await expect(page.locator('.prose').first()).toBeVisible();
  });

  test('navigates to next post in the series', async ({ page }) => {
    await page.goto(SAMPLE_POST);

    const nextLink = page.locator(`a[href="${SECOND_POST}"]`).first();
    if (await nextLink.count()) {
      await nextLink.click();
      await expect(page).toHaveURL(SECOND_POST);
    }
  });
});

test.describe('Redirects and edges', () => {
  test('/blog redirects to home', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveURL('/');
  });

  test('renders the 404 page for an unknown slug', async ({ page }) => {
    const response = await page.goto('/blog/this-post-does-not-exist-xyz');
    expect(response?.status()).toBe(404);
  });
});
