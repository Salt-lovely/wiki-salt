/*
 * @Author: Salt
 * @Date: 2024-03-10 16:46:27
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-23 19:23:50
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\openEditModal\codeMirror.ts
 */
import { saltConsole } from 'Utils/utils'
import { h, isString, readAndListen, write } from 'salt-lib'
import { configPrefix } from 'src/constant/note'
import WikiConstant from 'src/constant/wiki'

const { log } = saltConsole

export const ENABLE_CODE_MIRROR = `${configPrefix}EditEnableCodeMirror`

const cmCode = 'ext.CodeMirror'
const cmLibCode = 'ext.CodeMirror.lib'
const cmAddonCode = 'ext.CodeMirror.addons'
const cmMwCode = 'ext.CodeMirror.mode.mediawiki'
const cmJsCode = 'ext.CodeMirror.lib.mode.javascript'
const cmCssCode = 'ext.CodeMirror.lib.mode.css'

const contentToType: Record<string, string> = {
  wikitext: cmMwCode,
  javascript: cmJsCode,
  css: cmCssCode,
}
/** 检查当前Wiki是否存在CodeMirror拓展 */
export function queryCodeMirror() {
  const cmState = window.mw?.loader.getState(cmCode)
  if (!isString(cmState)) return false
  return true
}
function timeout<T>(
  promise: Promise<T>,
  message = '加载超时',
  time = 10000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((res, rej) => setTimeout(() => rej({ message }), time)),
  ])
}
export async function waitLoader(module: string, time = 20000) {
  const cmState = window.mw.loader.getState(module)
  if (cmState !== 'ready') {
    log('加载Wiki安装的CodeMirror拓展', module)
    await timeout(window.mw.loader.using(module), `加载${module}超时`)
  }
}
/** 加载Wiki安装的CodeMirror拓展 */
export async function loadCodeMirror(title: string) {
  if (!window.mw?.loader.using) return false // 没有加载好
  await waitLoader(cmLibCode)
  await waitLoader(cmAddonCode)
  await waitLoader(cmCode)
  // const cmState = window.mw.loader.getState(cmCode)
  // if (!cmState || cmState === 'missing') return false
  // if (cmState !== 'ready') {
  //   try {
  //     await timeout(
  //       window.mw.loader.using('ext.wikiEditor'),
  //       `加载ext.wikiEditor超时`
  //     )
  //     await timeout(
  //       window.mw.loader.using('ext.visualEditor.core'),
  //       `加载ext.visualEditor.core超时`
  //     )
  //     await timeout(window.mw.loader.using(cmCode), `加载${cmCode}超时`)
  //   } catch (e) {
  //     return false
  //   }
  // }
  const modeCode =
    contentToType[WikiConstant.pageContentModel] || contentToType.wikitext
  await waitLoader(modeCode)
  // const modeState = window.mw.loader.getState(modeCode)
  // if (!modeState || modeState === 'missing') return false
  // if (modeState !== 'ready') {
  //   try {
  //     await Promise.race([
  //       window.mw.loader.using(modeCode),
  //       new Promise((res, rej) =>
  //         setTimeout(() => rej({ message: `加载${modeCode}超时` }), 10000)
  //       ),
  //     ])
  //   } catch (e) {
  //     return false
  //   }
  // }
  return true
}

export function enableCodeMirrorButton(
  state: {},
  methods: {
    prependBtn: (btn: HTMLElement) => void
    showCMEditor: () => void
    showTextAreaEditor: () => void
  }
) {
  let [enableCM] = readAndListen({
    key: ENABLE_CODE_MIRROR,
    defaultValue: false,
    listener({ newValue }) {
      enableCM = newValue || false
      enableCMButton.className = `wiki-salt-modal-title-btn cm-${
        enableCM ? 'enable' : 'disable'
      }`
      if (enableCM) methods.showCMEditor()
      else methods.showTextAreaEditor()
    },
  })
  const enableCMButton = h(
    'div',
    {
      className: `wiki-salt-modal-title-btn cm-${
        enableCM ? 'enable' : 'disable'
      }`,
      title: `使用代码高亮编辑框，需要当前Wiki安装CodeMirror编辑器拓展方可起效`,
      // title: `使用代码高亮编辑框,更改后需要重新打开编辑框方可起效
      // 当前状态：${enableCM ? '启用' : '停用'}`,
      onClick: () => {
        enableCM = !enableCM
        write(ENABLE_CODE_MIRROR, enableCM)
        enableCMButton.className = `wiki-salt-modal-title-btn cm-${
          enableCM ? 'enable' : 'disable'
        }`
        if (enableCM) methods.showCMEditor()
        else methods.showTextAreaEditor()
      },
    },
    h('span', { className: 'cm-btn-txt left-angle' }, '<'),
    h('span', { className: 'cm-btn-txt center-slash' }, '/'),
    h('span', { className: 'cm-btn-txt right-angle' }, '>')
  )
  methods.prependBtn(enableCMButton)
  return {
    enableCM,
    enableCMButton,
    /** 获取配置项：当前是否启用CM编辑器 */
    getEnableCM: () => {
      return enableCM
    },
  }
}

const editorConfig: Record<
  string,
  {
    mode: string
    inputStyle: 'textarea' | 'contenteditable'
    lineWrapping: boolean
  }
> = {
  wikitext: {
    mode: 'text/mediawiki',
    inputStyle: 'contenteditable',
    lineWrapping: true,
  },
  javascript: {
    mode: 'javascript',
    inputStyle: 'contenteditable',
    lineWrapping: false,
  },
  css: { mode: 'css', inputStyle: 'contenteditable', lineWrapping: false },
}

export function useCodeMirror(
  el: HTMLElement,
  state: { editTxt: string },
  methods: { showCMEditor: () => void }
) {
  if (!window.CodeMirror) return false
  const editor = window.CodeMirror(el, {
    ...(editorConfig[WikiConstant.pageContentModel] || editorConfig.wikitext),
    value: state.editTxt,
    // 下面的是试验出来的
    // @ts-ignore
    // finishInit: () => {
    //   editor.setValue(state.editTxt);
    //   methods.showCMEditor()
    // },
    addModeClass: false,
    allowDropFileTypes: null,
    autocapitalize: false,
    autocorrect: false,
    autofocus: false,
    // @ts-ignore
    autoRefresh: true,
    coverGutterNextToScrollbar: false,
    cursorBlinkRate: 530,
    cursorHeight: 1,
    cursorScrollMargin: 0,
    dragDrop: true,
    electricChars: true,
    extraKeys: {
      End: 'goLineRight',
      Home: 'goLineLeft',
      'Shift-Tab': false,
      Tab: false,
    },
    firstLineNumber: 1,
    fixedGutter: true,
    flattenSpans: true,
    // gutters: [],
    historyEventDelay: 1250,
    indentUnit: 2,
    indentWithTabs: false,
    keyMap: 'default',
    lineNumbers: true, // true,
    lineWiseCopyCut: true,
    // lineWrapping: true,
    // @ts-ignore
    matchBrackets: {
      highlightNonMatching: false,
      maxHighlightLineLength: 10000,
    },
    maxHighlightLength: 10000,
    // @ts-ignore
    moveInputWithCursor: true,
    pasteLinesPerSelection: true,
    // phrases: {},
    pollInterval: 100,
    readOnly: false,
    resetSelectionOnContextMenu: true,
    rtlMoveVisually: false,
    screenReaderLabel: '维基盐编辑器的CodeMirror编辑框',
    scrollbarStyle: 'native',
    selectionsMayTouch: false,
    showCursorWhenSelecting: false,
    singleCursorHeightPerLine: true,
    smartIndent: true,
    spellcheck: true,
    tabSize: 4,
    tabindex: 1,
    theme: 'default',
    undoDepth: 200,
    viewportMargin: Infinity,
    // @ts-ignore
    wholeLineUpdateBefore: true,
    workDelay: 100,
    workTime: 100,
    // @ts-ignore
    mwConfig: window.mw.config.values.extCodeMirrorConfig,
  })
  // console.log('editor', editor)
  return editor
}
