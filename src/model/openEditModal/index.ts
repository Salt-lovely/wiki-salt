/*
 * @Author: Salt
 * @Date: 2022-08-04 22:27:41
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-05 00:05:01
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\openEditModal\index.ts
 */

import WikiConstant from 'src/constant/wiki'
import h from 'Utils/h'
import { addStyle } from 'Utils/resource'
import createEditModal from './createEditModal'
import style from './index.t.scss'

addStyle(style)
export const editModalTitle = h('div', {
  className: 'wiki-salt-edit-modal-title-text',
})
const editModalContent = h('div', { className: 'wiki-salt-edit-modal-content' })
export const editModal = h(
  'div',
  {
    className: 'wiki-salt-edit-modal hide',
    id: 'wiki-salt-edit-modal',
  },
  h(
    'div',
    { className: 'wiki-salt-edit-modal-title' },
    editModalTitle,
    h(
      'div',
      {
        className: 'wiki-salt-edit-modal-title-close',
        onclick: () => {
          editModal.classList.remove('show')
          editModal.classList.add('hide')
        },
      },
      '×'
    )
  ),
  editModalContent
)

export function openEditModal(props?: {
  title?: string
  section?: string
  sectionTitle?: string
}) {
  const modalProps = {
    title: props?.title || WikiConstant.currentPageName,
    section: props?.section,
    sectionTitle: props?.sectionTitle,
  }
  createEditModal(editModalContent, modalProps)
}
// TODO
export function openEditModalInit() {
  document.body.appendChild(editModal)
}
