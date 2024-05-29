import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jestPlugin from 'eslint-plugin-jest';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    {
        // config with just ignores is the replacement for `.eslintignore`
        ignores: ['**/build/**', '**/dist/**', 'coverage', 'docker'],
    },

    // Turns off all rules that are unnecessary or might conflict with Prettier.
    prettierConfig,

    // recommended eslint config
    eslint.configs.recommended,

    // strict: a superset of recommended that includes more opinionated rules which may also catch bugs.
    ...tseslint.configs.strict,

    // stylistic: additional rules that enforce consistent styling without significantly catching bugs or changing logic.
    ...tseslint.configs.stylistic,

    // ESLint plugin for Jest
    {
        files: ['**/*.spec.ts'],
        ...jestPlugin.configs['flat/recommended']
    }
);