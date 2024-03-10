/*
 * @LastEditTime: 2024-03-10 19:20:18
 * @Description: 打包到 dist
 */

const { banner } = require('./banner')

const commonBuild = {
  props: {
    banner,
  },
  define: {
    __DEV__: 'false',
    'process.env.NODE_ENV': '"production"',
  },
}

const core = require('./tools/core')
const $P = require('./tools/format-print')
const $T = require('./tools/format-time')

console.log($P('MCBSSWiki widget - bundle ' + $T(), 'grey'))
;(async () => {
  let start, end
  console.log($P(' BUNDLE ', 'b', 'white', 'cyanbg'), '正在打包')
  start = Date.now()
  await core(commonBuild)
  end = Date.now()
  console.log(
    $P(' SUCCED ', 'b', 'white', 'greenbg'),
    '完成打包',
    $P(` ${end - start}ms`, 'grey')
  )
})()
