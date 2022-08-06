/*
 * @Author: Salt
 * @Date: 2022-08-06 10:34:15
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-06 15:05:41
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\components\Modal\index.ts
 */
import h from 'Utils/h'
import { addStyle } from 'Utils/resource'
import style from './index.t.scss'
import { resizeBind } from './resize'

addStyle(style)

export function createModal(props: {
  isFixed?: boolean
  id?: string
  className?: string
  titleClassName?: string
  titleContainerClassName?: string
  closeButton?: boolean
  buttons?: HTMLElement[]
  onClose?: () => false | Promise<false> | unknown
  height?: number | string
  width?: number | string
  top?: number | string
  left?: number | string
  draggable?: boolean
}) {
  const {
    isFixed = true,
    className = '',
    id,
    titleClassName = '',
    titleContainerClassName = '',
    closeButton = true,
    buttons = [],
    onClose,
    height = window.innerHeight * 0.8,
    width = window.innerWidth * 0.8,
    top = window.innerHeight * 0.1,
    left = window.innerWidth * 0.1,
  } = props
  const closeBtn = closeButton
    ? h(
        'div',
        {
          className: 'wiki-salt-modal-title-close-btn',
          onclick: async () => {
            if (onClose) {
              const res = await onClose()
              if (res === false) return
            }
            unbindResize() // 移除移动模态框的相关事件
            modalContainer.remove() // 移出模态框
          },
        },
        '×'
      )
    : null
  const modalTitle = h('div', {
    className: 'wiki-salt-modal-title ' + titleClassName,
  })
  const modalTitleContainer = h(
    'div',
    { className: 'wiki-salt-modal-title-container ' + titleContainerClassName },
    modalTitle,
    buttons,
    closeBtn
  )
  const modalContentContainer = h('div', {
    className: 'wiki-salt-modal-content-container',
  })
  // 拖拽用的条
  const leftBar = h('div', {
    className: 'wiki-salt-modal-drag-bar wiki-salt-modal-drag-bar-left',
  })
  const rightBar = h('div', {
    className: 'wiki-salt-modal-drag-bar wiki-salt-modal-drag-bar-right',
  })
  const topBar = h('div', {
    className: 'wiki-salt-modal-drag-bar wiki-salt-modal-drag-bar-top',
  })
  const bottomBar = h('div', {
    className: 'wiki-salt-modal-drag-bar wiki-salt-modal-drag-bar-bottom',
  })
  // 容器
  const modalContainer = h(
    'div',
    {
      className: `wiki-salt-modal ${
        isFixed ? 'wiki-salt-modal-fix' : 'wiki-salt-modal-abs'
      } ${className}`,
    },
    modalTitleContainer,
    modalContentContainer,
    leftBar,
    rightBar,
    topBar,
    bottomBar
  )
  if (id) modalContainer.id = id
  modalContainer.style.height =
    typeof height === 'number' ? `${height.toFixed(2)}px` : height
  modalContainer.style.width =
    typeof width === 'number' ? `${width.toFixed(2)}px` : width
  modalContainer.style.top =
    typeof top === 'number' ? `${top.toFixed(2)}px` : top
  modalContainer.style.left =
    typeof left === 'number' ? `${left.toFixed(2)}px` : left
  document.body.appendChild(modalContainer)
  const unbindResize = resizeBind({
    container: modalContainer,
    dragBar: modalTitleContainer,
    leftBar,
    rightBar,
    topBar,
    bottomBar,
  })
  return {
    /** 模态框容器 */
    modalContainer,
    /** 模态框标题容器 */
    modalTitleContainer,
    /** 模态框标题 */
    modalTitle,
    /** 模态框内容容器 */
    modalContentContainer,
  }
}
