/*
 * @Author: Salt
 * @Date: 2022-08-04 22:25:14
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-21 19:39:55
 * @Description: 添加编辑按钮
 * @FilePath: \wiki-salt\src\model\addEditBtn\index.ts
 */
import WikiConstant from 'src/constant/wiki'
import vector from './vector'

const skinConvertor: { [skin: string]: () => unknown } = {
  vector,
}
/** 添加编辑按钮 */
export function addEditBtnInit() {
  if (WikiConstant.action !== 'view') return
  //
  const skin = WikiConstant.skin
  ;(skinConvertor[skin] || skinConvertor.vector)()
}
