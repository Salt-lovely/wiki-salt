/*
 * @Author: Salt
 * @Date: 2022-08-06 12:54:10
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-07 00:49:52
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\components\Modal\resize.ts
 */

type OriginStatus = {
  x: number
  y: number
  top: number
  left: number
  w: number
  h: number
}

export function resizeBind(props: {
  container: HTMLElement
  /** 拖拽 */
  dragBar?: HTMLElement
  /** 左侧拉伸 */
  leftBar?: HTMLElement
  /** 右侧拉伸 */
  rightBar?: HTMLElement
  /** 上方拉伸 */
  topBar?: HTMLElement
  /** 下方拉伸 */
  bottomBar?: HTMLElement
  callback?: (props: {
    top: number
    left: number
    width: number
    height: number
  }) => unknown
}) {
  let origin: OriginStatus = { x: 0, y: 0, top: 0, left: 0, w: 0, h: 0 }
  let type: 'drag' | 'left' | 'right' | 'top' | 'bottom' = 'drag'
  const { container, callback } = props
  const { dragBar, leftBar, rightBar, topBar, bottomBar } = props
  const moveMove = (ev: MouseEvent) => {
    const { currentTarget } = ev
    if (currentTarget !== window) return
    const handler = {
      drag: bindDrag,
      left: bindLeft,
      right: bindRight,
      top: bindTop,
      bottom: bindBottom,
    }
    const obj = { container, origin, ev }
    handler[type](obj)
  }
  const mouseDown = (ev: MouseEvent) => {
    const { x, y, target, currentTarget } = ev
    if (currentTarget !== window) return
    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = container
    origin = {
      x,
      y,
      top: offsetTop,
      left: offsetLeft,
      w: offsetWidth,
      h: offsetHeight,
    }
    if (
      target instanceof HTMLElement &&
      [dragBar, leftBar, rightBar, topBar, bottomBar].includes(target)
    ) {
      window.addEventListener('mousemove', moveMove)
      container.classList.add('user-select-none')
      if (target === dragBar) type = 'drag'
      else if (target === leftBar) type = 'left'
      else if (target === rightBar) type = 'right'
      else if (target === topBar) type = 'top'
      else if (target === bottomBar) type = 'bottom'
    }
  }
  const mouseUp = (ev: MouseEvent) => {
    const { currentTarget } = ev
    if (currentTarget !== window) return
    container.classList.remove('user-select-none')
    window.removeEventListener('mousemove', moveMove)
    if (callback) {
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = container
      callback({
        top: offsetTop,
        left: offsetLeft,
        width: offsetWidth,
        height: offsetHeight,
      })
    }
  }
  if (dragBar) {
    dragBar
  }
  window.addEventListener('mousedown', mouseDown)
  window.addEventListener('mouseup', mouseUp)
  return () => {
    window.removeEventListener('mousemove', mouseDown)
    window.removeEventListener('mouseup', mouseUp)
    window.removeEventListener('mousemove', moveMove)
  }
}
/** 拖动 */
function bindDrag(props: {
  container: HTMLElement
  ev: MouseEvent
  origin: OriginStatus
}) {
  const { ev, container, origin } = props
  const { x, y } = ev
  const { x: ox, y: oy, top, left, w, h } = origin
  let calcTop = top + y - oy
  let calcLeft = left + x - ox
  if (calcTop < 0) calcTop = 0
  else if (calcTop + h > window.innerHeight) calcTop = window.innerHeight - h
  if (calcLeft < 0) calcLeft = 0
  else if (calcLeft + w > window.innerWidth) calcLeft = window.innerWidth - w
  container.style.top = `${calcTop}px`
  container.style.left = `${calcLeft}px`
}
function bindLeft(props: {
  container: HTMLElement
  ev: MouseEvent
  origin: OriginStatus
}) {
  const { ev, container, origin } = props
  const { x } = ev
  const { x: ox, left, w } = origin
  let calcLeft = left + x - ox
  if (calcLeft < 0) calcLeft = 0
  // cw >= 0.2ww
  // cw = w - cl + l
  // w - cl + l >= 0.2ww
  // w + l - 0.2ww >= cl
  else if (calcLeft > w + left - window.innerWidth * 0.2) {
    // 宽度不得小于屏幕宽度的20%
    calcLeft = w + left - window.innerWidth * 0.2
  }
  let calcWidth = w - calcLeft + left
  container.style.width = `${calcWidth}px`
  container.style.left = `${calcLeft}px`
}
function bindRight(props: {
  container: HTMLElement
  ev: MouseEvent
  origin: OriginStatus
}) {
  const { ev, container, origin } = props
  const { x } = ev
  const { x: ox, w } = origin
  let calcWidth = w + x - ox
  // 宽度不得小于屏幕宽度的20%
  if (calcWidth < window.innerWidth * 0.2) calcWidth = window.innerWidth * 0.2
  container.style.width = `${calcWidth}px`
}
function bindTop(props: {
  container: HTMLElement
  ev: MouseEvent
  origin: OriginStatus
}) {
  const { ev, container, origin } = props
  const { y } = ev
  const { y: oy, top, h } = origin
  let calcTop = top + y - oy
  if (calcTop < 0) calcTop = 0
  else if (calcTop > h + top - window.innerHeight * 0.3) {
    // 高度不得小于屏幕高度的30%
    calcTop = h + top - window.innerHeight * 0.3
  }
  let calcHeight = h - calcTop + top
  container.style.height = `${calcHeight}px`
  container.style.top = `${calcTop}px`
}
function bindBottom(props: {
  container: HTMLElement
  ev: MouseEvent
  origin: OriginStatus
}) {
  const { ev, container, origin } = props
  const { y } = ev
  const { y: oy, h } = origin
  let calcHeight = h + y - oy
  // 高度不得小于屏幕高度的30%
  if (calcHeight < window.innerHeight * 0.3)
    calcHeight = window.innerHeight * 0.3
  container.style.height = `${calcHeight}px`
}
