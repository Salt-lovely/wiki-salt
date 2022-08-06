/*
 * @Author: Salt
 * @Date: 2022-08-04 20:24:09
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-06 14:55:27
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\init\index.ts
 */
import { addStyle } from 'Utils/resource'
import { apiInit } from './api'
import style from '../scss/global.t.scss'

export async function init() {
  addStyle(style)
  await apiInit()
}
