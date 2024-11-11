/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 110,
  trailingComma: 'es5',
  endOfLine: 'lf',
  singleQuote: true,
  semi: false,
  jsxSingleQuote: true,
  arrowParens: 'avoid',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: [
    'react/?(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@blockone/?(.*)$',
    '^e2e/?(.*)$',
    '^mock/?(.*)$',
    '^src/?(.*)$',
    '^[./]',
  ],
}

export default config
