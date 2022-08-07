/*
 * @Author: Salt
 * @Date: 2022-08-04 22:29:16
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-07 23:06:15
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\openEditModal\createEditModal.ts
 */
import { confirmModal, createModal } from 'Components/Modal'
import { info } from 'Components/notice'
import h from 'Utils/h'
import { saltConsole } from 'Utils/utils'
import {
  defaultSummary,
  getWikiText,
  parseWikiText,
  postEdit,
} from 'Utils/wiki'

const { log } = saltConsole

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
    modalTitle,
    modalContentContainer,
    closeModal,
  } = createModal({
    className: 'wiki-salt-edit-modal',
    titleContainerClassName: 'wiki-salt-edit-modal-title',
    resizeCallback: ({ width, height }) => {
      if (width > 960) {
        modalContentContainer.classList.remove('vertical')
        modalContentContainer.classList.add('horizon')
        modalContentContainer.style.setProperty(
          '--salt-wiki-editor-height',
          `${height}px`
        )
      } else {
        modalContentContainer.classList.add('vertical')
        modalContentContainer.classList.remove('horizon')
      }
    },
  })
  // 编辑框
  /** 编辑后的wikitext */
  let editTxt = '正在加载...'
  /** 编辑说明 */
  let summary = defaultSummary({ title, section, sectionTitle })
  /** 正在加载 */
  let isLoading = true
  /** 正在解析 */
  let isParsing = false
  /** 正在提交 */
  let isSubmit = false
  const editArea = h('textarea', {
    className: 'wiki-salt-edit-modal-edit-textarea',
    value: editTxt,
    oninput: () => {
      editTxt = editArea.value
    },
    onchange: () => {
      editTxt = editArea.value
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
        if (isSubmit || isLoading) return false
        previewBtn.textContent = '获取预览...'
        // const startTime = Date.now()
        const res = await parseTxt(editTxt, true)
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
        if (isSubmit || isLoading) return false
        isSubmit = true
        if (!(await confirmModal('您确定要提交编辑吗？'))) {
          isSubmit = false
          return false
        }
        submitBtn.textContent = '正在提交...'
        const startTime = Date.now()
        const res = await postEdit({
          title,
          section,
          sectionTitle,
          summary,
          wikitext: editTxt,
          originWikitext: originTxt as string,
        })
        if (res !== false) {
          info(`编辑提交成功，耗时${Date.now() - startTime}ms，将刷新页面`)
          setTimeout(() => {
            closeModal()
            location.reload()
          }, 2500)
        } else {
          info(`编辑提交失败`)
        }
      },
    },
    '提交'
  )
  const summaryInput = h('input', {
    className: 'wiki-salt-edit-modal-summary-input',
    value: summary,
    oninput: () => {
      summary = summaryInput.value
    },
    onchange: () => {
      summary = summaryInput.value
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
      summaryInput
    ),
    previewContent
  )
  // 宽度控制
  modalContentContainer.style.setProperty('--textareaWidth', `50%`)
  modalContentContainer.style.setProperty('--previewWidth', `50%`)
  modalContentContainer.classList.add(
    modalContentContainer.offsetWidth > 960 ? 'horizon' : 'vertical'
  )
  // 模态框标题
  modalTitle.textContent = `编辑“${title}”页面${
    sectionTitle ? `的“${sectionTitle}”章节` : ''
  }`
  // 显示编辑框
  modalContentContainer.appendChild(editPanel)
  modalContentContainer.appendChild(previewPanel)
  // 简单逻辑
  let lastParseTime = 0
  let timer = 0
  /** 解析wikitext并放到previewContent上 */
  const parseTxt = async (wikitext: string, force?: boolean) => {
    if (isSubmit) return false
    if (isParsing) {
      clearTimeout(timer)
      timer = setTimeout(() => parseTxt(wikitext), 500)
      return false
    }
    const debounce = 2000
    if (!force && Date.now() - lastParseTime < debounce) {
      const leftTime = debounce - Date.now() + lastParseTime
      clearTimeout(timer)
      timer = setTimeout(() => parseTxt(wikitext), leftTime)
      return false
    }
    isParsing = true
    const res = await parseWikiText({ wikitext, title })
    isParsing = false
    lastParseTime = Date.now()
    previewContent.innerHTML = res
  }
  // 获取文字和解析后的值
  const originTxt = await getWikiText({ title, section })
  if (originTxt === false) {
    closeModal()
    return
  }
  editArea.value = originTxt
  editTxt = originTxt
  await parseTxt(originTxt)
  isLoading = false
  editArea.disabled = false
}
