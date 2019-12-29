const path = require('path')
const fs = require('fs')
const babelJestTransformer = require('babel-jest')

const MODULE_DIR = /(.*([/\\]node_modules|\.\.)[/\\](@[^/\\]+[/\\])?[^/\\]+)([/\\].*)?$/g
// exclude invalid es modules from being babelized
const BABEL_EXCLUDE_MODULES = ['react-stripe-elements']
// modules which are not published as ESNEXT but should be processed with babel
const BABEL_INCLUDE_MODULES = ['autotrack', 'dom-utils', 'rmwc']

function shouldBabelize(filepath) {
  // process es6 modules with babel; ignore everything else
  if (filepath.split(/[/\\]/).indexOf('node_modules') === -1) {
    return true
  }
  const manifest = path.resolve(
    filepath.replace(MODULE_DIR, '$1'),
    'package.json',
  )
  const pkg = JSON.parse(fs.readFileSync(manifest))
  if (BABEL_EXCLUDE_MODULES.includes(pkg.name)) {
    return false
  }
  if (BABEL_INCLUDE_MODULES.includes(pkg.name)) {
    return true
  }
  // always use babel for @material components since we alias them
  if (pkg.name.startsWith('@material')) {
    return true
  }
  return !!(pkg.module || pkg['jsnext:main'])
}


module.exports = {
  ...babelJestTransformer,
  // otherwise we have some cache issues
  createTransformer: undefined,
  process: (src, filename, config, transformOptions) => {
    if (shouldBabelize(filename)) {
      return babelJestTransformer.process(
        src,
        filename,
        config,
        transformOptions,
      )
    }
    return src
  },
}
