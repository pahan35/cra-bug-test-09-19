module.exports = api => {
  return {
    presets: [
      [
        '@babel/env',
        {
          modules: false,
          loose: true,
          debug: false,
          targets: {},
        },
      ],
      ['@babel/preset-react', {development: !api.env('production')}],
    ],
    plugins: [
      // flow-strip-types MUST be before class-properties, see
      // https://github.com/babel/babel/issues/7233
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-proposal-class-properties',
      // disable loose mode so we can properly transofrm spread operator
      // here:
      // https://github.com/jamesmfriedman/rmwc/blob/4e695006c1d41dbc26dc3fdd4783084aee4ca7c8/src/base/foundation-component.js#L103-L105
      // https://github.com/babel/babel/issues/6649
      ['@babel/plugin-transform-spread', {loose: false}],
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-syntax-dynamic-import',
      'syntax-trailing-function-commas',
      [
        'replace-imports',
        {
          test: /^lodash\.(\w+)$/i,
          replacer(_, module) {
            return `lodash/${module === 'startswith' ? 'startsWith' : module}`
          },
        },
      ],
      [
        'transform-imports',
        {
          lodash: {
            /* eslint-disable-next-line no-template-curly-in-string */
            transform: 'lodash/${member}',
            preventFullImport: true,
          },
        },
      ],
      [
        '@babel/plugin-transform-runtime',
        {
          absoluteRuntime: true,
          corejs: '3',
          helpers: true,
          regenerator: true,
          useESModules: false,
        },
      ],
    ],
    env: {
      test: {
        presets: [
          [
            '@babel/env',
            {
              modules: 'commonjs',
              debug: false,
              targets: {
                node: 'current',
              },
            },
          ],
        ],
        plugins: [
          'transform-es2015-modules-commonjs',
          'dynamic-import-node',
          'syntax-dynamic-import',
        ],
      },
    },
  }
}
