/*
 * @LastEditTime: 2022-08-04 23:24:06
 * @Description: 打包到 dist
 */
const outFile = 'dist/index.js'

const commonBuild = {
  props: {
    outfile: outFile,
    minify: false,
    charset: 'utf8',
    legalComments: 'inline',
  },
  define: {
    __DEV__: 'false',
    'process.env.NODE_ENV': '"production"',
  },
}

const core = require('./tools/core')
const $P = require('./tools/format-print')
const $T = require('./tools/format-time')

;((argus) => {
  argus.forEach((args) => {
    if (args.startsWith('--')) {
      const widget = args.slice(2)
      commonBuild.props.entryPoints = [`widget/${widget}/widget.ts`]
      ;(commonBuild.props.outfile = `dist/widget-${widget}.js`),
        console.log($P(`打包微件${widget}`, 'grey'))
    }
  })
})(process.argv.slice(2))

console.log($P('MCBSSWiki widget - bundle ' + $T(), 'grey'))
;(async () => {
  let start, end
  console.log($P(' BUNDLE ', 'b', 'white', 'cyanbg'), '正在打包')
  start = Date.now()
  await core(commonBuild)
  end = Date.now()
  console.log(
    $P(' SUCCED ', 'b', 'white', 'greenbg'),
    '完成打包: ',
    $P(outFile, 'b'),
    $P(` ${end - start}ms`, 'grey')
  )
})()
