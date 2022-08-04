/*
 * @Author: Salt
 * @Date: 2022-08-04 20:24:09
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-04 20:46:27
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\init\index.ts
 */
import { apiInit } from './api'

export async function init() {
  await apiInit()
}
