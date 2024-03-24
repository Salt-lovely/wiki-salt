/*
 * @Author: Salt
 * @Date: 2024-03-24 19:17:59
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-24 19:28:39
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\model\saltWikiEditHelper\index.ts
 */
import { saltConsole } from 'Utils/utils'
import SaltWikiEditHelper from 'src/class/SaltWikiEditHelper'
import helpNote from 'src/class/help'

/** SaltWikiEditHelper对象 */
export function addSaltWikiEditHelperInit() {
  window.we = new SaltWikiEditHelper('1.0.1', helpNote)
  window.SaltWikiEditHelper = SaltWikiEditHelper
  saltConsole.log('SaltWikiEditHelper子模块初始化完成')
  saltConsole.log('\n' + helpNote.basic)
}
