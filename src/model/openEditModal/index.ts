/*
 * @Author: Salt
 * @Date: 2022-08-04 22:27:41
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-06 12:26:30
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\openEditModal\index.ts
 */

import WikiConstant from 'src/constant/wiki'
import h from 'Utils/h'
import { addStyle } from 'Utils/resource'
import createEditModal from './createEditModal'
import './editorCss'
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
