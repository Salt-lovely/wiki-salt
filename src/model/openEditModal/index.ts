/*
 * @Author: Salt
 * @Date: 2022-08-04 22:27:41
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-21 19:36:12
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\openEditModal\index.ts
 */

import WikiConstant from 'src/constant/wiki'
import { addStyle } from 'Utils/resource'
import createEditModal from './createEditModal'
import style from './index.t.scss'

addStyle(style)

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
  createEditModal(modalProps)
}
// TODO
export function openEditModalInit() {}
