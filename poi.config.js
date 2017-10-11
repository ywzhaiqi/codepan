const nodeModules = require('webpack-node-modules')

// const homepage = './'
const homepage = '/codepan/'
const cdns = {
  BABEL_CDN: 'https://cdn.jsdelivr.net/npm/babel-standalone@7.0.0-alpha.15/babel.min.js',
  PUG_CDN: 'https://cdn.jsdelivr.net/npm/browserified-pug@0.1.0/index.js',
  CSSNEXT_CDN: 'https://cdn.jsdelivr.net/npm/browserified-postcss-cssnext@0.1.1/index.js',
  POSTCSS_CDN: 'https://cdn.jsdelivr.net/npm/browserified-postcss@0.1.0/index.js'
}

module.exports = {
  extendWebpack(config) {
    config.module.noParse
      .add(/babel-preset-vue/)

    config.module.rule('js')
      .include
      .add(nodeModules())
  },
  production: {
    sourceMap: false
  },
  hash: false,
  homepage,
  env: Object.assign({}, cdns),
  presets: [
    require('poi-preset-bundle-report')(),
    require('poi-preset-offline')({
      pluginOptions: {
        version: '[hash]',
        autoUpdate: true,
        safeToUseOptionalCaches: true,
        caches: {
          main: ['index.html', 'client.*', 'vendor.*', 'editor-page.chunk.js'],
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
          // FALLBACK: { '/': '/' }
          FALLBACK: { '/': homepage }
        },
        externals: [
          'https://reasonml.github.io/bs.js',
          'https://reasonml.github.io/refmt.js'
        ].concat(Object.keys(cdns).reduce((res, name) => {
          return res.concat(cdns[name])
        }, []))
      }
    })
  ]
}
