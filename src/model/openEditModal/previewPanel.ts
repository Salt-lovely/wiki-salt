import { confirmModal, createModal } from 'Components/Modal'
import { alarm, info } from 'Components/notice'
import { h, readAndListen, write } from 'salt-lib'
import { configPrefix } from 'src/constant/note'
import {
  defaultSummary,
  getWikiText,
  parseWikiText,
  postEdit,
} from 'Utils/wiki'
import { saltConsole } from 'Utils/utils'
import { getEditErrorMsg } from './utils'

const { log } = saltConsole
export const DEFAULT_MINOR_KEY = `${configPrefix}EditDefaultMinor`
export const LIVE_PREVIEW_KEY = `${configPrefix}EditLivePreview`

export function createPreviewPanel(
  state: {
    editTxt: string
    originTxt: string | false
    summary: string
    isLoading: boolean
    isParsing: boolean
    isSubmit: boolean
    isSubmitSuccess: boolean
    isMinor: boolean
    isLivePreview: boolean
    title: string
    section: string | undefined
    sectionTitle: string | undefined
  },
  methods: {
    parseTxt: (wikitext: string, force?: boolean) => Promise<false | undefined>
    closeModal: () => Promise<void>
    prependBtn: (btn: HTMLElement) => void
  }
) {
  // 页面顶部按钮
  let [isDefaultMinor] = readAndListen({
    key: DEFAULT_MINOR_KEY,
    defaultValue: false,
    listener({ newValue }) {
      isDefaultMinor = newValue || false
      defaultMinorBtn.textContent = newValue ? '✔️默认小编辑' : '❌默认小编辑'
    },
  })
  const defaultMinorBtn = h(
    'div',
    {
      className: 'wiki-salt-modal-title-btn',
      onclick() {
        isDefaultMinor = !isDefaultMinor
        write(DEFAULT_MINOR_KEY, isDefaultMinor)
        defaultMinorBtn.textContent = isDefaultMinor
          ? '✔️默认小编辑'
          : '❌默认小编辑'
      },
    },
    isDefaultMinor ? '✔️默认小编辑' : '❌默认小编辑'
  )
  readAndListen({
    key: LIVE_PREVIEW_KEY,
    defaultValue: false,
    listener({ newValue }) {
      state.isLivePreview = newValue || false
      livePreviewBtn.textContent = newValue ? '✔️实时预览' : '❌实时预览'
    },
  })
  const livePreviewBtn = h(
    'div',
    {
      className: 'wiki-salt-modal-title-btn',
      onclick() {
        state.isLivePreview = !state.isLivePreview
        write(LIVE_PREVIEW_KEY, state.isLivePreview)
        livePreviewBtn.textContent = state.isLivePreview
          ? '✔️实时预览'
          : '❌实时预览'
      },
    },
    state.isLivePreview ? '✔️实时预览' : '❌实时预览'
  )
  methods.prependBtn(defaultMinorBtn)
  methods.prependBtn(livePreviewBtn)
  // 预览框
  const previewContent = h(
    'div',
    { className: 'wiki-salt-edit-modal-preview-content mw-body-content' },
    '正在加载...'
  )
  const previewBtn = h(
    'div',
    {
      className: 'wiki-salt-edit-modal-btn wiki-salt-edit-modal-preview-btn',
      onclick: async () => {
        if (state.isSubmit || state.isLoading) return false
        // const startTime = Date.now()
        const res = await methods.parseTxt(state.editTxt, true)
        if (res !== false) {
          // info(`获取预览成功，耗时${Date.now() - startTime}ms`)
        } else {
          info(`获取预览失败`)
        }
      },
    },
    '预览'
  )
  const submitBtn = h(
    'div',
    {
      className: 'wiki-salt-edit-modal-btn wiki-salt-edit-modal-preview-btn',
      onclick: async () => {
        if (state.isSubmit || state.isLoading) return false
        state.isSubmit = true
        if (!(await confirmModal('您确定要提交编辑吗？'))) {
          state.isSubmit = false
          return false
        }
        submitBtn.textContent = '正在提交...'
        const startTime = Date.now()
        try {
          const res = await postEdit({
            title: state.title,
            section: state.section,
            sectionTitle: state.sectionTitle,
            summary: state.summary,
            minor: state.isMinor,
            wikitext: state.editTxt,
            originWikitext: state.originTxt as string,
          })
          if (res !== false) {
            state.isSubmitSuccess = true
            info(`编辑提交成功，耗时${Date.now() - startTime}ms，将刷新页面`)
            setTimeout(() => {
              methods.closeModal()
              location.reload()
            }, 2500)
          } else {
            state.isSubmit = false
            info(`编辑提交失败`)
            submitBtn.textContent = '再次提交'
          }
        } catch (e) {
          log('编辑提交失败\n', e)
          state.isSubmit = false
          alarm(`${getEditErrorMsg(e)}`, '编辑提交失败')
          submitBtn.textContent = '再次提交'
        }
      },
    },
    '提交'
  )
  const minorBtn = h(
    'div',
    {
      className:
        'wiki-salt-edit-modal-btn wiki-salt-edit-modal-minor-btn not-minor',
      onclick: async () => {
        state.isMinor = !state.isMinor
        minorBtn.textContent = state.isMinor ? '✔️小编辑' : '❌小编辑'
        minorBtn.classList.add(state.isMinor ? 'is-minor' : 'not-minor')
        minorBtn.classList.remove(state.isMinor ? 'not-minor' : 'is-minor')
      },
    },
    state.isMinor ? '✔️小编辑' : '❌小编辑'
  )
  const summaryInput = h('input', {
    className: 'wiki-salt-edit-modal-summary-input',
    value: state.summary,
    oninput: () => {
      state.summary = summaryInput.value
    },
    onchange: () => {
      state.summary = summaryInput.value
    },
  })
  const previewPanel = h(
    'div',
    { className: 'wiki-salt-edit-modal-preview-panel' },
    h(
      'div',
      { className: 'wiki-salt-edit-modal-preview-btn-group' },
      previewBtn,
      submitBtn,
      minorBtn,
      summaryInput
    ),
    previewContent
  )
  return {
    previewContent,
    previewBtn,
    submitBtn,
    minorBtn,
    summaryInput,
    previewPanel,
  }
}
