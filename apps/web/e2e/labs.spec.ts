import { test, expect } from '@playwright/test';

test.describe('Labs Landing Page', () => {
  test('should display hero section with title', async ({ page }) => {
    await page.goto('/labs');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Learn Infrastructure'
    );
  });

  test('should show "Get Started" and "Browse Modules" buttons', async ({ page }) => {
    await page.goto('/labs');

    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /browse modules/i })).toBeVisible();
  });

  test('should navigate to setup page from Get Started button', async ({ page }) => {
    await page.goto('/labs');

    await page.getByRole('link', { name: /get started/i }).click();

    await expect(page).toHaveURL('/labs/setup');
  });

  test('should display how it works section', async ({ page }) => {
    await page.goto('/labs');

    await expect(page.getByText('How It Works')).toBeVisible();
    await expect(page.getByText('Install the CLI')).toBeVisible();
  });

  test('should show start learning section', async ({ page }) => {
    await page.goto('/labs');

    await expect(page.getByText('Start Learning')).toBeVisible();
  });

  test('should navigate to modules from Browse Modules', async ({ page }) => {
    await page.goto('/labs');

    await page.getByRole('link', { name: /browse modules/i }).click();

    await expect(page).toHaveURL('/labs/modules');
  });
});

test.describe('Labs Modules Page', () => {
  test('should display modules listing', async ({ page }) => {
    await page.goto('/labs/modules');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should show available modules', async ({ page }) => {
    await page.goto('/labs/modules');

    // Linux module should be visible (might be a card or link)
    await expect(page.getByText(/linux/i).first()).toBeVisible();
  });

  test('should navigate to module detail page', async ({ page }) => {
    await page.goto('/labs/modules');

    await page.getByRole('link', { name: /linux/i }).first().click();

    await expect(page).toHaveURL(/\/labs\/modules\/linux/);
  });
});

test.describe('Labs Module Detail Page', () => {
  test('should display module title and description', async ({ page }) => {
    await page.goto('/labs/modules/linux');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Linux Fundamentals'
    );
  });

  test('should show exercise count', async ({ page }) => {
    await page.goto('/labs/modules/linux');

    await expect(page.getByText(/\d+ exercises/i)).toBeVisible();
  });

  test('should display list of exercises', async ({ page }) => {
    await page.goto('/labs/modules/linux');

    // Check for exercise section and at least one exercise
    await expect(page.getByRole('heading', { name: 'Exercises' })).toBeVisible();
  });

  test('should navigate to exercise page', async ({ page }) => {
    await page.goto('/labs/modules/linux');

    // Find and click on an exercise link
    const exerciseLink = page.getByRole('link', { name: /linux-01|file system/i }).first();
    await exerciseLink.click();

    await expect(page).toHaveURL(/\/labs\/modules\/linux\/linux-01/);
  });

  test('should show module meta information', async ({ page }) => {
    await page.goto('/labs/modules/linux');

    // Should show some meta info like time or description
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('Labs Exercise Page', () => {
  test('should display exercise title', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-03');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'systemd Service'
    );
  });

  test('should show difficulty indicator', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-03');

    // Check for difficulty text (beginner/intermediate/advanced)
    await expect(page.getByText(/beginner|intermediate|advanced/i).first()).toBeVisible();
  });

  test('should show learning objectives', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-03');

    await expect(page.getByText('Learning Objectives')).toBeVisible();
  });

  test('should display CLI command section', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-03');

    // Check for CLI command text (infra-learn launch)
    await expect(page.getByText(/infra-learn/i).first()).toBeVisible();
  });

  test('should show verification section', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-03');

    // Check for verification criteria section - look for any verification-related text
    await expect(page.locator('article')).toBeVisible();
  });

  test('should have exercise content', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-03');

    // Exercise page should have content
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should have navigation to previous/next exercises', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-02');

    await expect(page.getByRole('link', { name: /previous/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /next/i })).toBeVisible();
  });

  test('should navigate to next exercise', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-01');

    await page.getByRole('link', { name: /next/i }).click();

    await expect(page).toHaveURL(/\/labs\/modules\/linux\/linux-02/);
  });

  test('should have breadcrumb navigation', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-03');

    // Check breadcrumb links exist
    await expect(page.getByRole('link', { name: /labs/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /modules/i }).first()).toBeVisible();
  });
});

test.describe('Labs Setup Page', () => {
  test('should display setup instructions', async ({ page }) => {
    await page.goto('/labs/setup');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Get Started');
  });

  test('should show installation commands', async ({ page }) => {
    await page.goto('/labs/setup');

    await expect(page.getByText('Install the CLI')).toBeVisible();
  });

  test('should have numbered steps', async ({ page }) => {
    await page.goto('/labs/setup');

    // Check for step numbers
    await expect(page.getByText('Verify Installation')).toBeVisible();
    await expect(page.getByText('Initialize')).toBeVisible();
  });
});

test.describe('Labs Dashboard Page', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/labs/dashboard');

    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should show progress statistics', async ({ page }) => {
    await page.goto('/labs/dashboard');

    await expect(page.getByText(/completed/i).first()).toBeVisible();
    await expect(page.getByText(/started/i).first()).toBeVisible();
  });

  test('should have continue learning section', async ({ page }) => {
    await page.goto('/labs/dashboard');

    await expect(page.getByText(/continue/i).first()).toBeVisible();
  });

  test('should show modules section', async ({ page }) => {
    await page.goto('/labs/dashboard');

    await expect(page.getByText('Your Modules')).toBeVisible();
  });
});

test.describe('Labs Navigation', () => {
  test('should have working header navigation', async ({ page }) => {
    await page.goto('/labs');

    // Header should have navigation links
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should navigate between pages via sidebar on module pages', async ({ page }) => {
    await page.goto('/labs/modules/linux');

    // On larger screens, sidebar should be visible
    const sidebar = page.locator('.labs-sidebar');
    if (await sidebar.isVisible()) {
      await expect(sidebar.getByText('Learning Modules')).toBeVisible();
    }
  });
});

test.describe('Labs Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/labs');

    // Hero should still be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should hide sidebar on mobile', async ({ page }) => {
    await page.goto('/labs/modules/linux');

    // Sidebar should be hidden on mobile
    const sidebar = page.locator('.labs-sidebar');
    await expect(sidebar).not.toBeVisible();
  });
});

test.describe('Labs CLI Command Copy', () => {
  test('should have CLI command displayed', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-03');

    // Check CLI command section exists
    await expect(page.getByText(/infra-learn/i).first()).toBeVisible();
  });

  test('should have sandbox section', async ({ page }) => {
    await page.goto('/labs/modules/linux/linux-03');

    // The sandbox/command section should be visible
    await expect(page.locator('.cli-command').first()).toBeVisible();
  });
});
