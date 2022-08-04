/*
 * @Author: Salt
 * @Date: 2022-08-04 22:29:16
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-05 00:33:44
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\openEditModal\createEditModal.ts
 */
import h from 'Utils/h'
import { saltConsole } from 'Utils/utils'
import { getWikiText, parseWikiText } from 'Utils/wiki'
import { editModal, editModalTitle } from '.'

const { log } = saltConsole

export default async function createEditModal(
  container: HTMLElement,
  props: { title: string; section?: string; sectionTitle?: string }
) {
  const { title, section, sectionTitle } = props
  log('打开编辑框', `title: ${title}, section: ${section} ${sectionTitle}`)
  const modal = h('div', null, '...')
  const previewContent = h('div')
  // 编辑框标题
  editModalTitle.textContent = `编辑“${title}”页面${
    sectionTitle ? `的“${sectionTitle}”章节` : ''
  }`
  // 显示编辑框
  container.innerHTML = ''
  container.appendChild(modal)
  container.appendChild(previewContent)
  editModal.classList.add('show')
  editModal.classList.remove('hide')
  //
  const txt = await getWikiText({ title, section })
  modal.textContent = txt
  const parse = await parseWikiText({ wikitext: txt, title })
  previewContent.innerHTML = parse
}
