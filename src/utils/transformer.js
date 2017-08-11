// eslint-disable import/no-mutable-exports
import progress from 'nprogress'
import loadjs from 'loadjs'

function asyncLoad(resources, name) {
  return new Promise((resolve, reject) => {
    if (loadjs.isDefined(name)) {
      resolve()
    } else {
      loadjs(resources, name, {
        success() {
          resolve()
        },
        error() {
          progress.done()
          reject(new Error('network error'))
        }
      })
    }
  })
}

class Transformers {
  constructor() {
    this.map = {}
  }

  set(k, v) {
    this.map[k] = v
  }

  get(k) {
    return this.map[k]
  }
}

const transformers = new Transformers()

async function loadBabel() {
  if (loadjs.isDefined('babel')) return

  progress.start()
  const [, VuePreset, VueJSXMergeProps, FlowPreset] = await Promise.all([
    asyncLoad(process.env.BABEL_CDN, 'babel'),
    import(/* webpackChunkName: "babel-stuffs" */ 'babel-preset-vue/dist/babel-preset-vue'), // use umd bundle since we don't want to parse `require`
    import(/* webpackChunkName: "babel-stuffs" */ '!raw-loader!./vue-jsx-merge-props'),
    import(/* webpackChunkName: "babel-stuffs" */ 'babel-preset-flow')
  ])
  transformers.set('VuePreset', VuePreset)
  transformers.set('VueJSXMergeProps', VueJSXMergeProps)
  transformers.set('FlowPreset', FlowPreset)
  progress.done()
}

async function loadPug() {
  if (loadjs.isDefined('pug')) return

  progress.start()
  await Promise.all([
    asyncLoad(process.env.PUG_CDN, 'pug'),
    import(/* webpackChunkName: "codemirror-mode-pug" */ 'codemirror/mode/pug/pug')
  ])
  progress.done()
}

async function loadMarkdown() {
  if (!transformers.get('markdown')) {
    progress.start()
    const [marked] = await Promise.all([
      import('marked3').then(m => m.default),
      import('codemirror/mode/markdown/markdown')
    ])
    transformers.set('markdown', marked)
    progress.done()
  }
}

async function loadSvelte() {
  if (!transformers.get('svelte')) {
    progress.start()
    const svelte = await import('svelte')
    transformers.set('svelte', svelte)
    progress.done()
  }
}

async function loadReason() {
  if (loadjs.isDefined('reason')) return

  progress.start()
  await asyncLoad([
    'https://reasonml.github.io/bs.js',
    'https://reasonml.github.io/refmt.js'
  ], 'reason')
  progress.done()
}

async function loadCoffeeScript2() {
  if (loadjs.isDefined('coffeescript-2')) return

  progress.start()
  await Promise.all([
    asyncLoad([
      '/vendor/coffeescript-2.js',
      // Need babel to transform JSX
      process.env.BABEL_CDN
    ], 'coffeescript-2'),
    import('codemirror/mode/coffeescript/coffeescript')
  ])
  progress.done()
}

export {
  loadBabel,
  loadPug,
  loadMarkdown,
  transformers,
  loadSvelte,
  loadReason,
  loadCoffeeScript2
}
