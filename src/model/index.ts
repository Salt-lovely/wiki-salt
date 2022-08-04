/*
 * @Author: Salt
 * @Date: 2022-08-04 22:24:56
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-04 22:46:34
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\index.ts
 */
import { docReady, saltConsole } from 'Utils/utils'
import { addEditBtnInit } from './addEditBtn'
import { openEditModalInit } from './openEditModal'

const { log } = saltConsole

export function model() {
  docReady(() => {
    log('正在初始化模块')
    addEditBtnInit()
    openEditModalInit()
  })
}
