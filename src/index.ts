/*
 * @Author: Salt
 * @Date: 2022-07-09 13:46:28
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-07 23:03:42
 * @Description: 入口文件
 * @FilePath: \wiki-salt\src\index.ts
 */
import { init } from './init'
import { model } from './model'

;(async () => {
  // 等待初始化
  await init()
  // 加载各个模块
  model()
})()
/*!
Copyright (c) 2022 Salt-lovely
wiki-salt is licensed under Mulan PSL v2.
You can use this software according to the terms and conditions of the Mulan PSL v2.
You may obtain a copy of Mulan PSL v2 at:
        http://license.coscl.org.cn/MulanPSL2
THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
See the Mulan PSL v2 for more details.
*/
/*!
// ==UserScript==
// @name         WikiSalt编辑工具
// @namespace    salt.is.lovely.wiki
// @version      1.0.1
// @description  WikiSalt编辑工具
// @author       Salt
// @match        https://mcbbs.wiki/index.php?*
// @match        https://mcbbs.wiki/wiki/*
// @match        https://wiki.biligame.com/*
// @grant        none
// ==/UserScript==
*/
