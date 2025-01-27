import globals from 'globals';
import jsConfig from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules/*', 'dist/*', 'coverage/*', '**/*.test.ts', "**/__tests__/**/*"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node, ...globals.browser,
        process: 'readonly',
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  jsConfig.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      prettier,
    },
    rules: {
      ...tsEslintPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'off',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      "no-console": ["warn", { "allow": ["info", "warn", "error"] }],
      'no-undef': 'error',
      "@typescript-eslint/no-empty-object-type": "off",
      '@typescript-eslint/no-unused-expressions': 'error',
      "@typescript-eslint/consistent-type-imports": ["warn", { "prefer": "type-imports" }],
      "no-unused-vars": ["off", {
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": false
      }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": false
        }
      ],
      // "no-use-before-define": "off",
    },
  },
  {
    files: ["src/**/*types.ts", "src/**/*interfaces.ts"],
    rules: { "no-unused-vars": "off" },
  },
  {
    files: ['src/classes/**/*.ts', "src/**/*types.ts", "src/**/types/*.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" }
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    rules: { "@typescript-eslint/no-require-imports": "off" }
  }
];
