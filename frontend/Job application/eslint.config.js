import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // ✅ Semicolon rules — missing semicolon will show as browser overlay error
      'semi': ['error', 'always'],
      'semi-spacing': ['error', { before: false, after: true }],

      // ✅ Common mistakes that cause confusing runtime errors
      'no-undef': 'error',              // Catches undefined variables
      'no-unused-vars': 'warn',         // Warns about unused variables
      'no-extra-semi': 'error',         // Catches duplicate semicolons
      'no-unreachable': 'error',        // Code after return/break/throw
      'no-use-before-define': 'warn',   // Using variable before declaring it
      'eqeqeq': ['warn', 'always'],     // == vs === catches subtle bugs
    },
  },
])
