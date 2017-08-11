const nodeModules = require('webpack-node-modules')

// const homepage = './'
const homepage = '/codepan/'

module.exports = {
  extendWebpack(config) {
    config.module.noParse
      .add(/babel-standalone/)
      .add(/browserified-pug/)
      .add(/babel-preset-vue/)

    config.module.rule('js')
      .include
      .add(nodeModules())
  },
  production: {
    sourceMap: false
  },
  homepage,
  presets: [
    require('poi-preset-bundle-report')(),
    require('poi-preset-offline')({
      pluginOptions: {
        version: '[hash]',
        autoUpdate: true,
        safeToUseOptionalCaches: true,
        caches: {
          main: ['index.html', 'client.*.*', 'vendor.*.*', 'editor-page.*.chunk.js'],
          additional: ['*.chunk.js', ':externals:'],
          optional: [':rest:']
        },
        publicPath: homepage,
        // ServiceWorker: {
        //   events: true,
        //   navigateFallbackURL: '/'
        // },
        ServiceWorker: false,
        AppCache: {
          events: true,
          FALLBACK: { './': './' }
        }
      }
    })
  ]
}
