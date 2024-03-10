/*
 * @LastEditTime: 2022-08-07 17:34:54
 * @Description: 本地热更新服务
 */
const { banner } = require('./banner')
const path = require('path')
const core = require('./tools/core')
const $P = require('./tools/format-print')
const $T = require('./tools/format-time')

console.log($P('MCBSSWiki widget - serve ' + $T(), 'grey'))
;(async () => {
  const onRebuild = (error) => {
    if (error) {
      console.error(
        $P(' ERROR ', 'b', 'white', 'redbg'),
        '出现错误',
        $P($T(), 'grey')
      )
    } else {
      console.log(
        $P(' WATCH ', 'b', 'white', 'greenbg'),
        '代码变动, 自动更新',
        $P($T(), 'grey')
      )
    }
  }
  await core({
    props: {
      banner,
      watch: { onRebuild },
    },
  })
  console.log($P(' SERVE ', 'b', 'white', 'cyanbg'), '编译完成, 开启服务中')
})()
