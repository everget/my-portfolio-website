export default {
    extends: ['stylelint-config-standard'],
    plugins: [],
    reportDescriptionlessDisables: true,
    reportInvalidScopeDisables: true,
    reportNeedlessDisables: true,
    reportUnscopedDisables: true,
    rules: {
        'import-notation': null,
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    // Tailwind v3 at-rules
                    'apply',
                    'config',
                    'layer',
                    'tailwind',
                    // Tailwind v4 at-rules
                    'theme',
                    'source',
                    'utility',
                    'variant',
                    'custom-variant',
                ],
            },
        ],
        'block-no-empty': true,
        'color-named': null,
        'declaration-no-important': true,
        'no-unknown-animations': true,
    },
};
