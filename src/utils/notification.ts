/*
 * @Author: Salt
 * @Date: 2022-08-04 20:33:47
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-04 20:59:21
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\utils\notification.ts
 */
import h from 'Utils/h'
import 'notification.scss'

interface basicDialogProps {
  className?: string
  title?: string | HTMLElement
  content?: string | HTMLElement
  /** 多久后消失，默认为5000毫秒 */
  time?: number
  /** 消失动画时间，默认为300毫秒 */
  fadeTime?: number
}

export const container = h('div', {
  className: 'wiki-salt-notification-container',
  id: 'wiki-salt-notification-container',
})

function basicDialog(props: basicDialogProps) {
  const { className, title, content, time = 5000, fadeTime = 300 } = props
  const dialog = h(
    'div',
    {
      className: `wiki-salt-notification ${className}`,
    },
    title
      ? h('div', { className: 'wiki-salt-notification-title' }, title)
      : null,
    content
      ? h('div', { className: 'wiki-salt-notification-content' }, content)
      : null
  )
  setTimeout(() => {
    dialog.classList.add('fade-out')
    setTimeout(() => {
      dialog.remove()
    }, fadeTime)
  }, time)
  container.appendChild(dialog)
}

const notification = {}

export default notification
