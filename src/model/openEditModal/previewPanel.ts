import { confirmModal, createModal } from 'Components/Modal'
import { info } from 'Components/notice'
import { h } from 'salt-lib'
import {
  defaultSummary,
  getWikiText,
  parseWikiText,
  postEdit,
} from 'Utils/wiki'

export function createPreviewPanel(
  state: {
    editTxt: string
    originTxt: string | false
    summary: string
    isLoading: boolean
    isParsing: boolean
    isSubmit: boolean
    isMinor: boolean
    title: string
    section: string | undefined
    sectionTitle: string | undefined
  },
  methods: {
    parseTxt: (wikitext: string, force?: boolean) => Promise<false | undefined>
    closeModal: () => Promise<void>
  }
) {
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
        previewBtn.textContent = '获取预览...'
        // const startTime = Date.now()
        const res = await methods.parseTxt(state.editTxt, true)
        previewBtn.textContent = '预览'
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
          info(`编辑提交成功，耗时${Date.now() - startTime}ms，将刷新页面`)
          setTimeout(() => {
            methods.closeModal()
            location.reload()
          }, 2500)
        } else {
          info(`编辑提交失败`)
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
    '❌小编辑'
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