/*
 * @Author: Salt
 * @Date: 2022-08-04 22:25:14
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-24 18:05:36
 * @Description: 添加编辑按钮
 * @FilePath: \wiki-salt\src\model\addEditBtn\index.ts
 */
import WikiConstant from 'src/constant/wiki'
import vector from './vector'
import { saltConsole } from 'Utils/utils';

const skinConvertor: { [skin: string]: (skin: string) => unknown } = {
  vector,
  'vector-2022': vector,
}
/** 添加编辑按钮 */
export function addEditBtnInit() {
  if (WikiConstant.action !== 'view') return
  //
  const skin = WikiConstant.skin
  ;(skinConvertor[skin] || skinConvertor.vector)(skin)
  saltConsole.log('添加编辑按钮子模块初始化完成')
}
