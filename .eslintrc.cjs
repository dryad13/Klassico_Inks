module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'dist-probe', 'node_modules', '.tmp', 'design-system', '*.config.js'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh'],
  overrides: [
    {
      // react-three-fiber renders three.js objects as JSX intrinsics, so its
      // props are unknown to eslint-plugin-react. The rule only understands DOM.
      files: ['src/v2/components/hero/**/*.jsx'],
      rules: { 'react/no-unknown-property': 'off' },
    },
  ],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 'off',
  },
}
