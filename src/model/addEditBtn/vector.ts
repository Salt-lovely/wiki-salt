/*
 * @Author: Salt
 * @Date: 2022-08-04 22:30:26
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-05 00:10:21
 * @Description: vector皮肤添加编辑按钮
 * @FilePath: \wiki-salt\src\model\addEditBtn\vector.ts
 */
import { openEditModal } from 'Model/openEditModal'
import h from 'Utils/h'

const topEditBtnQuery = '#ca-edit'
const sectionEditBtnQuery = '.mw-editsection > a[href*="&action=edit"]'
export default function vector() {
  // 顶部编辑按钮
  const topBtn = document.body.querySelector(topEditBtnQuery)
  const btn = h(
    'li',
    {
      className: 'mw-list-item collapsible wiki-salt-top-edit-btn',
      id: 'wiki-salt-top-edit-btn',
    },
    h(
      'a',
      {
        href: '',
        onclick: (ev) => {
          ev.preventDefault()
          openEditModal()
        },
      },
      '🧂编辑'
    )
  )
  if (topBtn) {
    if (topBtn.nextSibling) {
      topBtn.parentElement!.insertBefore(btn, topBtn.nextSibling)
    } else {
      topBtn.parentElement!.appendChild(btn)
    }
  }
  // 每个章节的编辑按钮
  const sections = Array.from(
    document.body.querySelectorAll(sectionEditBtnQuery)
  ) as HTMLAnchorElement[]
  sections.forEach((el) => {
    const section = (el.href.match(/section=([^&]+)/) || [])[1] || undefined
    const sectionTitle =
      el.parentElement!.parentElement!.querySelector('.mw-headline')
        ?.textContent || ''
    const secBtn = h(
      'a',
      {
        title: sectionTitle,
        onclick: (ev) => {
          ev.preventDefault()
          openEditModal({ section, sectionTitle })
        },
      },
      '🧂编辑'
    )
    const divider = h('span', { className: 'mw-editsection-divider' }, ' | ')
    if (el.nextSibling) {
      const _ns = el.nextSibling
      el.parentElement!.insertBefore(divider, _ns)
      el.parentElement!.insertBefore(secBtn, _ns)
    } else {
      el.parentElement!.appendChild(divider)
      el.parentElement!.appendChild(secBtn)
    }
  })
}
