export const VALID_THEMES = ['light', 'dark'] as const;
export type Theme = (typeof VALID_THEMES)[number];

export interface ThemePreference {
    theme: Theme;
}
