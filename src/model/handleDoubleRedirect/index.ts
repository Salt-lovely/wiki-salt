/*
 * @Author: Salt
 * @Date: 2022-08-21 19:35:08
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-09 16:10:28
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\handleDoubleRedirect\index.ts
 */
import { confirmModal } from 'Components/Modal'
import WikiConstant from 'src/constant/wiki'
import h from 'Utils/h'
import { postEdit } from 'Utils/wiki'
/** 双重重定向处理 */
export function handleDoubleRedirect() {
  const { currentSpecialPageName } = WikiConstant
  if (currentSpecialPageName !== 'DoubleRedirects') return
  const content = document.querySelector('.mw-spcontent') // 特殊页面的主体部分
  if (!content) return
  const list = Array.from(
    content.querySelectorAll('ul.special li,ol.special li')
  ) as HTMLElement[] // 列表
  if (!list?.length) return
  list.forEach((li) => {
    const finalPage = (
      li.querySelector(
        'a[title]:not(.mw-redirect):not([href*="edit"])'
      ) as HTMLAnchorElement
    )?.title
    const startPage = (
      li.querySelector(
        'a[title].mw-redirect:not([href*="edit"])'
      ) as HTMLAnchorElement
    )?.title
    const editBtn = li.querySelector(
      'a[href*="action=edit"]'
    ) as HTMLAnchorElement
    if (!finalPage || !startPage || !editBtn) return
    const fastBtn = h(
      'a',
      {
        className: 'mw-redirect',
        title: `将“${startPage}”重定向到“${finalPage}”`,
      },
      '（更改重定向）'
    )
    fastBtn.addEventListener('click', async () => {
      const isConfirm = await confirmModal(
        h(
          'span',
          null,
          '将“',
          h('code', null, startPage),
          '”重定向到“',
          h('code', null, finalPage),
          '”，请确认？'
        )
      )
      if (!isConfirm) return false
      fastBtn.textContent = '（正在重定向...）'
      await postEdit({
        title: startPage,
        wikitext: `#重定向 [[${finalPage}]]`,
        minor: true,
        summary: `将“${startPage}”重定向到“${finalPage}”，维基盐双重重定向快速修复`,
      })
      fastBtn.textContent = '（请刷新页面检查效果）'
    })
    editBtn.parentElement!.insertBefore(fastBtn, editBtn)
  })
}
