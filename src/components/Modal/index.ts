/*
 * @Author: Salt
 * @Date: 2022-08-06 10:34:15
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-10 02:41:18
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\components\Modal\index.ts
 */
import { h } from 'salt-lib'
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
  onBeforeClose?: () => false | Promise<false> | unknown
  height?: number | string
  width?: number | string
  top?: number | string
  left?: number | string
  draggable?: boolean
  resizeCallback?: (props: {
    top: number
    left: number
    width: number
    height: number
  }) => unknown
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
    onBeforeClose,
    height = window.innerHeight * 0.8,
    width = window.innerWidth * 0.8,
    top = window.innerHeight * 0.1,
    left = window.innerWidth * 0.1,
    resizeCallback,
  } = props
  const closeModal = async () => {
    if (onBeforeClose) {
      const res = await onBeforeClose()
      if (res === false) return
    }
    if (onClose) {
      const res = await onClose()
    }
    unbindResize() // 移除移动模态框的相关事件
    modalContainer.classList.add('wiki-salt-fade-out')
    setTimeout(() => modalContainer.remove(), 300) // 移除模态框
  }
  const closeBtn = closeButton
    ? h(
        'div',
        {
          className:
            'wiki-salt-modal-title-btn wiki-salt-modal-title-close-btn',
          onclick: () => closeModal(),
        },
        '×'
      )
    : null
  const modalTitle = h('div', {
    className: 'wiki-salt-modal-title ' + titleClassName,
  })
  const modalTitleButtons = h(
    'div',
    { className: 'wiki-salt-modal-title-buttons' },
    buttons,
    closeBtn
  )
  const modalTitleContainer = h(
    'div',
    { className: 'wiki-salt-modal-title-container ' + titleContainerClassName },
    modalTitle,
    modalTitleButtons
  )
  const modalContentContainer = h('div', {
    className: 'wiki-salt-modal-content-container',
  })
  // 拖拽用的条
  const leftBar = h('div', {
    className: 'wiki-salt-modal-drag-bar wiki-salt-modal-drag-bar-left',
    title: '调整宽度',
  })
  const rightBar = h('div', {
    className: 'wiki-salt-modal-drag-bar wiki-salt-modal-drag-bar-right',
    title: '调整宽度',
  })
  const topBar = h('div', {
    className: 'wiki-salt-modal-drag-bar wiki-salt-modal-drag-bar-top',
    title: '调整高度',
  })
  const bottomBar = h('div', {
    className: 'wiki-salt-modal-drag-bar wiki-salt-modal-drag-bar-bottom',
    title: '调整高度',
  })
  // 容器
  const modalContainer = h(
    'div',
    {
      className: `wiki-salt-modal wiki-salt-fade-in ${
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
    callback: resizeCallback,
  })
  return {
    /** 模态框容器 */
    modalContainer,
    /** 模态框标题容器 */
    modalTitleContainer,
    /** 模态框标题栏右侧按钮容器 */
    modalTitleButtons,
    /** 模态框标题 */
    modalTitle,
    /** 模态框内容容器 */
    modalContentContainer,
    /** 关闭模态框 */
    closeModal,
  }
}

const contentWithFooterClassName =
  'wiki-salt-modal-content-container wiki-salt-modal-content-container-with-footer'
const centerModalClassName =
  'wiki-salt-modal wiki-salt-fade-in wiki-salt-modal-fix wiki-salt-modal-fix-center'
/** 点击确认弹框，确定返回`Promise<true>`，取消返回`Promise<false>` */
export async function confirmModal(
  props:
    | {
        title?: string | Element
        content: string | Element
      }
    | string
    | Element
): Promise<boolean> {
  const defer = {} as {
    promise: Promise<boolean>
    res: (value: boolean | PromiseLike<boolean>) => void
    rej: (reason?: any) => void
  }
  defer.promise = new Promise<boolean>((res, rej) => {
    defer.res = res
    defer.rej = rej
  })
  // 获取内容
  const content =
    typeof props === 'string' || props instanceof Element
      ? props
      : props.content
  const modalContentContainer = h(
    'div',
    { className: contentWithFooterClassName },
    content
  )
  // 获取标题
  const title =
    typeof props === 'string' || props instanceof Element ? null : props.content
  // 如果没有标题栏就不渲染
  const modalTitleContainer = title
    ? h('div', {
        className: 'wiki-salt-modal-title-container',
      })
    : null
  // 底部按钮
  const footer = h(
    'div',
    {
      className: `wiki-salt-modal-footer-container`,
    },
    h(
      'div',
      { className: 'wiki-salt-modal-footer-btn-group' },
      h(
        'div',
        {
          className: 'wiki-salt-modal-footer-btn',
          onclick: () => {
            closeModal()
            defer.res(false)
          },
        },
        '取消'
      ),
      h(
        'div',
        {
          className: 'wiki-salt-modal-footer-btn btn-primary',
          onclick: () => {
            closeModal()
            defer.res(true)
          },
        },
        '确定'
      )
    )
  )
  // 渲染
  const modalContainer = h(
    'div',
    { className: centerModalClassName },
    modalTitleContainer,
    modalContentContainer,
    footer
  )
  const closeModal = () => {
    unbindResize()
    modalContainer.classList.add('wiki-salt-fade-out')
    setTimeout(() => modalContainer.remove(), 300) // 移除模态框
  }
  const unbindResize = resizeBind({
    container: modalContainer,
    dragBar: modalContainer,
  })
  document.body.appendChild(modalContainer)
  return defer.promise
}
