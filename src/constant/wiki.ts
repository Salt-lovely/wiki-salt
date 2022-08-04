/*
 * @Author: Wikiplus
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-05 00:36:48
 * @Description: 使用了Wikiplus的src/utils/constants.js
 * @FilePath: \wiki-salt\src\constant\wiki.ts
 */
/** 代码来源于Wikiplus，见https://github.com/Wikiplus/Wikiplus/blob/dev/src/utils/constants.js，这里对比原版有删改 */
class WikiConstants {
  get isArticle() {
    return window.mw.config.get('wgIsArticle')
  }
  /** 页面名 */
  get currentPageName(): string {
    return window.mw.config.get('wgPageName').replace(/ /g, '_')
  }
  get articleId() {
    return window.mw.config.get('wgArticleId')
  }
  get revisionId() {
    return window.mw.config.get('wgRevisionId')
  }
  get latestRevisionId() {
    return window.mw.config.get('wgCurRevisionId')
  }
  get articlePath() {
    return window.mw.config.get('wgArticlePath')
  }
  /** */
  get scriptPath(): string {
    return window.mw.config.get('wgScriptPath')
  }
  /** 当前操作类型，`view`为浏览，`edit`为编辑 */
  get action(): 'edit' | 'view' | 'history' | 'delete' | 'protect' {
    return window.mw.config.get('wgAction')
  }
  /** 皮肤名 */
  get skin(): string {
    return window.mw.config.get('skin')
  }
  /** 用户名，未登录时为`null` */
  get userName(): string | null {
    return window.mw.config.get('wgUserName')
  }
  /** 用户Id，未登录时为`null` */
  get userId(): number | null {
    return window.mw.config.get('wgUserId')
  }
  /** 用户组，未登录时为`["*"]` */
  get userGroups(): string[] {
    return window.mw.config.get('wgUserGroups')
  }
  get wikiId() {
    return window.mw.config.get('wgWikiID')
  }
  get apiUrl() {
    return `${location.protocol}//${location.host}${window.mw.config.get('wgScriptPath')}/api.php`
  }
}
const WikiConstant = new WikiConstants()
export default WikiConstant
