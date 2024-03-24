/*
 * @Author: Salt
 * @Date: 2022-08-04 22:24:56
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-24 19:27:32
 * @Description: wiki-salt功能模块
 * @FilePath: \wiki-salt\src\model\index.ts
 */
import { docReady, saltConsole } from 'Utils/utils'
import { addEditBtnInit } from './addEditBtn'
import { handleDoubleRedirect } from './handleDoubleRedirect'
import { openEditModalInit } from './openEditModal'
import { addSaltWikiEditHelperInit } from './saltWikiEditHelper'

const { log } = saltConsole

export function model() {
  docReady(() => {
    log('正在初始化模块')
    addEditBtnInit()
    openEditModalInit()
    handleDoubleRedirect()
    addSaltWikiEditHelperInit()
  })
}
