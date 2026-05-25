import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('nav link scrolls to section', async ({ page }) => {
        await page.getByRole('link', { name: 'Skills' }).first().click();
        await expect(page.locator('#skills')).toBeInViewport();
    });

    test('theme toggle switches dark/light class on <html>', async ({ page }) => {
        const html = page.locator('html');
        const before = await html.getAttribute('class');

        await page.getByRole('button', { name: /switch to (dark|light) theme/i }).click();

        const after = await html.getAttribute('class');
        expect(after).not.toBe(before);
    });

    test('mobile menu opens and closes', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });

        const trigger = page.getByRole('button', { name: /toggle navigation menu/i });
        await expect(trigger).toBeVisible();

        await trigger.click();
        await expect(page.locator('#mobile-nav')).toBeVisible();

        await trigger.click();
        await expect(page.locator('#mobile-nav')).not.toBeVisible();
    });

    test('mobile nav link closes menu', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });

        await page.getByRole('button', { name: /toggle navigation menu/i }).click();
        await page.locator('#mobile-nav').getByRole('link', { name: 'Projects' }).click();

        await expect(page.locator('#mobile-nav')).not.toBeVisible();
    });
});
