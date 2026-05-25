import { expect, test } from '@playwright/test';

test.describe('Smoke', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('page loads', async ({ page }) => {
        await expect(page.locator('body')).toBeVisible();
    });

    test('header shows nav links', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Skills' })).toBeVisible();
    });

    test('hero section renders with heading and contact links', async ({ page }) => {
        const hero = page.locator('#about');

        await expect(hero).toBeVisible();
        await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(hero.getByRole('link', { name: 'alex.everget161@gmail.com' })).toBeVisible();
        await expect(hero.getByRole('link', { name: 'github.com/everget' })).toBeVisible();
        await expect(hero.getByRole('link', { name: /linkedin/i })).toBeVisible();
    });

    test('projects section renders cards', async ({ page }) => {
        const section = page.locator('#projects');

        await expect(section).toBeVisible();
        await expect(section.getByRole('heading', { name: /featured projects/i })).toBeVisible();
        await expect(section.getByRole('link', { name: /view code/i }).first()).toBeVisible();
    });

    test('skills section renders categories', async ({ page }) => {
        const section = page.locator('#skills');

        await expect(section).toBeVisible();
        await expect(section.getByRole('heading', { name: /skills/i })).toBeVisible();
        await expect(section.locator('h3').first()).toBeVisible();
    });
});
