/*
 * @Author: Salt
 * @Date: 2022-08-04 22:29:16
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-10 03:29:20
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\openEditModal\createEditModal.ts
 */
import { confirmModal, createModal } from 'Components/Modal'
import { info } from 'Components/notice'
import { h, read } from 'salt-lib'
import {
  defaultSummary,
  getWikiText,
  parseWikiText,
  postEdit,
} from 'Utils/wiki'
import {
  DEFAULT_MINOR_KEY,
  LIVE_PREVIEW_KEY,
  createPreviewPanel,
} from './previewPanel'
import { createResizeBar } from './resizeBar'

export default async function createEditModal(props: {
  title: string
  section?: string
  sectionTitle?: string
}) {
  const { title, section, sectionTitle } = props
  // 对话框
  const {
    modalContainer,
    modalTitleContainer,
    modalTitleButtons,
    modalTitle,
    modalContentContainer,
    closeModal,
  } = createModal({
    className: 'wiki-salt-edit-modal',
    titleContainerClassName: 'wiki-salt-edit-modal-title',
    resizeCallback: ({ width, height }) => {
      Object.assign(state, {
        width: modalContentContainer.offsetWidth,
        height: modalContentContainer.offsetHeight,
      })
    },
    buttons: [],
  })
  // 简单逻辑
  let lastParseTime = 0
  // let lastSechTime = 0
  let timer = 0
  const debounce = 1000
  const maxDebounce = 10000
  const state = {
    width: modalContentContainer.offsetWidth,
    height: modalContentContainer.offsetHeight,
    /** 编辑后的wikitext */
    editTxt: '正在加载...',
    /** 编辑说明 */
    summary: defaultSummary({ title, section, sectionTitle }),
    /** 正在加载 */
    isLoading: true,
    /** 正在解析 */
    isParsing: false,
    /** 正在提交 */
    isSubmit: false,
    /** 是否为小编辑 */
    isMinor: read(DEFAULT_MINOR_KEY, false),
    /** 是否实时预览 */
    isLivePreview: read(LIVE_PREVIEW_KEY, false),
    title,
    section,
    sectionTitle,
    originTxt: '' as string | false,
  }
  const methods = {
    /** 解析wikitext并放到previewContent上 */
    parseTxt: async (wikitext: string, force?: boolean) => {
      if (state.isSubmit) return false
      if (state.isParsing) {
        clearTimeout(timer)
        timer = setTimeout(() => methods.parseTxt(wikitext), debounce)
        // lastSechTime = Date.now()
        return false
      }
      if (!force && Date.now() - lastParseTime < maxDebounce) {
        const leftTime = maxDebounce - Date.now() + lastParseTime
        clearTimeout(timer)
        timer = setTimeout(() => methods.parseTxt(wikitext), Math.min(leftTime, debounce))
        // lastSechTime = Date.now()
        return false
      }
      state.isParsing = true
      previewBtn.textContent = '预览...'
      const res = await parseWikiText({ wikitext, title })
      state.isParsing = false
      previewContent.innerHTML = res
      previewBtn.textContent = '预览'
      lastParseTime = Date.now()
    },
    closeModal,
    prependBtn: (btn: HTMLElement) => {
      modalTitleButtons.prepend(btn)
    },
  }
  // 编辑框
  const editArea = h('textarea', {
    className: 'wiki-salt-edit-modal-edit-textarea',
    value: state.editTxt,
    oninput: () => {
      state.editTxt = editArea.value
      if (state.isLivePreview) methods.parseTxt(state.editTxt, false)
    },
    onchange: () => {
      state.editTxt = editArea.value
    },
    disabled: true,
  })
  const editPanel = h(
    'div',
    {
      className: 'wiki-salt-edit-modal-edit-panel',
    },
    editArea
  )
  // 预览框
  const {
    previewContent,
    previewBtn,
    submitBtn,
    minorBtn,
    summaryInput,
    previewPanel,
  } = createPreviewPanel(state, methods)
  // 宽度控制
  const { horizonBar, verticalBar } = createResizeBar(
    state,
    methods,
    modalContentContainer
  )
  // 模态框标题
  modalTitle.textContent = `编辑“${title}”页面${
    sectionTitle ? `的“${sectionTitle}”章节` : ''
  }`
  // 显示编辑框
  modalContentContainer.appendChild(editPanel)
  modalContentContainer.appendChild(horizonBar)
  // modalContentContainer.appendChild(verticalBar)
  modalContentContainer.appendChild(previewPanel)
  // 获取文字和解析后的值
  state.originTxt = await getWikiText({ title, section })
  if (state.originTxt === false) {
    info(`获取页面失败`)
    closeModal()
    return
  }
  editArea.value = state.originTxt
  state.editTxt = state.originTxt
  state.isLoading = false
  editArea.disabled = false
  await methods.parseTxt(state.originTxt)
}
