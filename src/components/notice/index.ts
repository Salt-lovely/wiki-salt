/*
 * @Author: Salt
 * @Date: 2022-08-04 20:33:47
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-07 15:29:21
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\components\notice\index.ts
 */
import { h } from 'salt-lib'
import { addStyle } from 'Utils/resource'
import style from './index.t.scss'

addStyle(style)
interface basicDialogProps {
  className?: string
  title?: string | HTMLElement
  content?: string | HTMLElement
  /** 多久后消失，默认为5000毫秒 */
  time?: number
  /** 消失动画时间，默认为300毫秒 */
  fadeTime?: number
  /** 显示一个可以点击关闭的叉叉 */
  closeable?: boolean
  /** 方位，从`0`“上中”开始顺时针，默认为`1`即“右上” */
  pos?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
}

const pos = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']

const positionContainers = Array(8)
  .fill(0)
  .map((_, i) =>
    h('div', {
      className: `wiki-salt-notice-container wiki-salt-notice-container-${pos[i]}`,
    })
  )

export const container = h(
  'div',
  {
    className: 'wiki-salt-notice',
    id: 'wiki-salt-notice',
  },
  positionContainers
)

document.body.appendChild(container)
// TODO closeable
function basicDialog(props: basicDialogProps) {
  const {
    className,
    title,
    content,
    time = 5000,
    fadeTime = 2000,
    closeable = false,
    pos = 1,
  } = props
  const dialog = h(
    'div',
    {
      className: `wiki-salt-notice wiki-salt-fade-in ${className}`,
    },
    title ? h('div', { className: 'wiki-salt-notice-title' }, title) : null,
    content
      ? h('div', { className: 'wiki-salt-notice-content' }, content)
      : null
  )
  setTimeout(() => {
    dialog.classList.add('fade-out')
    setTimeout(() => {
      dialog.remove()
    }, fadeTime)
  }, time)
  positionContainers[pos]?.appendChild(dialog)
}

export function info(
  content: string | HTMLElement,
  title?: string | HTMLElement,
  timeout = 5000
) {
  basicDialog({
    className: 'wiki-salt-notice-info',
    title,
    content,
    time: timeout,
  })
}

export function alarm(
  content: string | HTMLElement,
  title?: string | HTMLElement,
  timeout = 5000
) {
  console.log(content)
  basicDialog({
    className: 'wiki-salt-notice-alarm',
    title,
    content,
    time: timeout,
  })
}

export function done(
  content: string | HTMLElement,
  title?: string | HTMLElement,
  timeout = 5000
) {
  basicDialog({
    className: 'wiki-salt-notice-done',
    title,
    content,
    time: timeout,
  })
}
