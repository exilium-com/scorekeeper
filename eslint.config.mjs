import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettier from 'eslint-config-prettier'

export default defineConfigWithVueTs(
    {
        ignores: ['dist/**', 'coverage/**', 'references/**'],
    },
    js.configs.recommended,
    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,
    // disable/turn off all formatting-related ESLint rules in favor of Prettier
    // prefer the recommended config from eslint-config-prettier when available
    (prettier && prettier.configs && prettier.configs.recommended) || prettier,
    {
        files: ['**/*.{ts,tsx,js,jsx,vue}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/no-template-shadow': 'warn',
            'vue/require-prop-types': 'warn',
            'vue/v-bind-style': ['warn', 'shorthand'],
            'vue/v-on-event-hyphenation': ['warn', 'always', { autofix: true }],
            'vue/v-slot-style': [
                'warn',
                {
                    atComponent: 'v-slot',
                    default: 'longform',
                    named: 'longform',
                },
            ],
            'vue/block-order': ['warn', { order: [['script', 'template'], 'style'] }],
            'vue/block-lang': ['warn', { script: { lang: 'ts', allowNoLang: true } }],
        },
    }
)
