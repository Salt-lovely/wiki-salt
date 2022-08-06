/*
 * @Author: Salt
 * @Date: 2022-08-04 22:29:16
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-06 12:48:39
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\openEditModal\createEditModal.ts
 */
import { createModal } from 'Components/Modal'
import h from 'Utils/h'
import { saltConsole } from 'Utils/utils'
import { getWikiText, parseWikiText } from 'Utils/wiki'

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
  } = createModal({
    className: 'wiki-salt-edit-modal',
    titleContainerClassName: 'wiki-salt-edit-modal-title',
  })
  // 编辑框
  /** 编辑后的wikitext */
  let editTxt = '正在加载...'
  const editArea = h('textarea', {
    className: 'wiki-salt-edit-modal-edit-textarea',
    value: editTxt,
    oninput: () => {
      editTxt = editArea.value
    },
    onchange: () => {
      editTxt = editArea.value
    },
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
    { className: 'wiki-salt-edit-modal-preview-content' },
    '正在加载...'
  )
  const previewBtn = h(
    'div',
    {
      className: 'wiki-salt-edit-modal-btn wiki-salt-edit-modal-preview-btn',
      onclick: () => parseTxt(editTxt),
    },
    '预览'
  )
  const previewPanel = h(
    'div',
    { className: 'wiki-salt-edit-modal-preview-panel' },
    h(
      'div',
      { className: 'wiki-salt-edit-modal-preview-btn-group' },
      previewBtn
    ),
    previewContent
  )
  // 模态框标题
  modalTitle.textContent = `编辑“${title}”页面${
    sectionTitle ? `的“${sectionTitle}”章节` : ''
  }`
  // 显示编辑框
  modalContentContainer.appendChild(editPanel)
  modalContentContainer.appendChild(previewPanel)
  // 简单逻辑
  let isParsing = false
  let lastParseTime = 0
  let timer = 0
  /** 解析wikitext并放到previewContent上 */
  const parseTxt = async (wikitext: string, force?: boolean) => {
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
  editArea.value = originTxt
  editTxt = originTxt
  parseTxt(originTxt)
}
