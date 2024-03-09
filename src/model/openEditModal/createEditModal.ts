/*
 * @Author: Salt
 * @Date: 2022-08-04 22:29:16
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-10 03:54:26
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
    onBeforeClose: async () => {
      if (!state.isLoading && !state.isSubmitSuccess) {
        if (state.originTxt !== false && state.editTxt !== state.originTxt) {
          return await confirmModal('您有未保存的更改，确定要关闭编辑框吗？')
        }
        if (state.isSubmit) {
          return await confirmModal(`正在提交编辑，确定要关闭编辑框吗？`)
        }
      }
    },
    onClose: () => {
      window.onclose = window.onbeforeunload = null
    },
  })
  // 防止手滑退出
  window.onclose = window.onbeforeunload = () => {
    if (!state.isLoading && !state.isSubmitSuccess) {
      if (state.originTxt !== false && state.editTxt !== state.originTxt) {
        return '您有未保存的更改，确定要关闭编辑框吗？'
      }
      if (state.isSubmit) {
        return `正在提交编辑，确定要关闭编辑框吗？`
      }
    }
  }
  // 简单逻辑
  let lastParseTime = 0 // `parseTxt`上一次成功解析
  let lastSechTime = 0 // `parseTxt`上一次计划时间
  let timer = 0 // `parseTxt`计划下一次执行
  const debounce = 1000 // `parseTxt`防抖
  const maxDebounce = 10000 // `parseTxt`最大执行间隔
  // 状态
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
    /** 提交成功 */
    isSubmitSuccess: false,
    /** 是否为小编辑 */
    isMinor: read(DEFAULT_MINOR_KEY, false),
    /** 是否实时预览 */
    isLivePreview: read(LIVE_PREVIEW_KEY, false),
    title,
    section,
    sectionTitle,
    originTxt: false as string | false,
  }
  // 方法
  const methods = {
    /** 解析wikitext并放到previewContent上 */
    parseTxt: async (wikitext: string, force?: boolean) => {
      if (state.isSubmit) return false
      const now = Date.now()
      if (state.isParsing) {
        clearTimeout(timer)
        timer = setTimeout(() => methods.parseTxt(wikitext), debounce)
        lastSechTime = now
        return false
      }
      if (
        !force &&
        now - lastSechTime < debounce &&
        now - lastParseTime < maxDebounce
      ) {
        const leftTime = Math.min(maxDebounce - now + lastParseTime, debounce)
        clearTimeout(timer)
        timer = setTimeout(() => methods.parseTxt(wikitext), leftTime)
        lastSechTime = Date.now()
        return false
      }
      state.isParsing = true
      previewBtn.textContent = '预览...'
      const res = await parseWikiText({ wikitext, title })
      state.isParsing = false
      previewContent.innerHTML = res
      previewBtn.textContent = '预览'
      lastParseTime = Date.now()
      lastSechTime = Date.now()
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
