import { h, read, readAndListen, write } from 'salt-lib'
import { configPrefix } from 'src/constant/note'

export const IS_HORIZON_KEY = `${configPrefix}EditTextareaType`
export const TEXTAREA_WIDTH_KEY = `${configPrefix}EditTextareaWidth`

export function createResizeBar(
  state: { width: number; height: number },
  methods: {},
  container: HTMLElement
) {
  const horizonBar = h(
    'div',
    {
      className: 'wiki-salt-edit-modal-horizon-bar',
      title: '左右拖动可以调整宽度，双击恢复宽度',
    },
    h('div', { className: 'wiki-salt-edit-modal-bar-icon' }, '|||')
  )
  const verticalBar = h(
    'div',
    {
      className: 'wiki-salt-edit-modal-vertical-bar',
    },
    h('div', { className: 'wiki-salt-edit-modal-bar-icon' }, '---')
  )
  let [isHorizon] = readAndListen({
    key: IS_HORIZON_KEY,
    defaultValue: container.offsetWidth > 960 ? 'horizon' : 'vertical',
    listener({ newValue }) {
      isHorizon = newValue || 'horizon'
      setStyle()
    },
  })
  let [textareaWidth] = readAndListen({
    key: TEXTAREA_WIDTH_KEY,
    defaultValue: 50,
    listener({ newValue }) {
      textareaWidth = Number(newValue) || 50
      if (isHorizon === 'horizon') setStyle()
    },
  })
  const setStyle = () => {
    if (isHorizon === 'horizon') {
      container.classList.remove('vertical')
      container.classList.add('horizon')
      container.style.setProperty('--textareaWidth', `${textareaWidth}%`)
      container.style.setProperty('--previewWidth', `${100 - textareaWidth}%`)
      horizonBar.title = `左右拖动可以调整宽度，双击恢复宽度；
当前宽度 ${textareaWidth.toFixed(2)}% : ${(100 - textareaWidth).toFixed(2)}%`
    } else {
      container.classList.add('vertical')
      container.classList.remove('horizon')
    }
  }
  setStyle()
  bindHorizon({
    horizonBar,
    container,
    callback(width: number, record = false) {
      textareaWidth = width
      if (record) write(TEXTAREA_WIDTH_KEY, width)
      setStyle()
    },
  })
  return { horizonBar, verticalBar }
}

function bindHorizon({
  horizonBar,
  container,
  callback,
}: {
  horizonBar: HTMLElement
  container: HTMLElement
  callback: (width: number, record?: boolean) => unknown
}) {
  const innerState = {
    x: 0,
    w: 0,
    active: false,
  }
  horizonBar.addEventListener('dblclick', (ev) => {
    console.log(ev)
    // if (ev.button === 2) {
    callback(50, true)
    ev.preventDefault()
    // }
  })
  horizonBar.addEventListener('mousedown', (ev) => {
    if (ev.button === 0) {
      innerState.active = true
      innerState.x = ev.x
      innerState.w = Number(read(TEXTAREA_WIDTH_KEY, 50)) || 50
      ev.preventDefault()
    }
  })
  container.addEventListener('mousemove', (ev) => {
    if (innerState.active) {
      const deX = innerState.x - ev.x
      const deW = Number(((deX / container.offsetWidth) * 100).toFixed(4))
      // console.log('deX', deX, 'deW', deW)
      const res = Math.min(Math.max(innerState.w - deW, 25), 75)
      callback(res)
      ev.preventDefault()
    }
  })
  container.addEventListener('mouseup', (ev) => {
    if (innerState.active) {
      innerState.active = false
      const deX = innerState.x - ev.x
      const deW = Number(((deX / container.offsetWidth) * 100).toFixed(4))
      // console.log('deX', deX, 'deW', deW)
      const res = Math.min(Math.max(innerState.w - deW, 25), 75)
      callback(res, true)
      ev.preventDefault()
    }
  })
}
