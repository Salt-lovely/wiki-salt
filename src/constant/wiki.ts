/*
 * @Author: Wikiplus
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-07 23:01:41
 * @Description: 使用了Wikiplus的src/utils/constants.js
 * @FilePath: \wiki-salt\src\constant\wiki.ts
 */
const getConfig = <T>(config: string): T => window.mw?.config.get(config)

/** 代码来源于Wikiplus，见https://github.com/Wikiplus/Wikiplus/blob/dev/src/utils/constants.js，这里对比原版有删改 */
class WikiConstants {
  get isArticle(): boolean {
    return getConfig('wgIsArticle')
  }
  /** 页面名 */
  get currentPageName(): string {
    return getConfig<string>('wgPageName').replace(/ /g, '_')
  }
  get articleId() {
    return getConfig('wgArticleId')
  }
  get revisionId() {
    return getConfig('wgRevisionId')
  }
  get latestRevisionId() {
    return getConfig('wgCurRevisionId')
  }
  get articlePath() {
    return getConfig('wgArticlePath')
  }
  /** */
  get scriptPath(): string {
    return getConfig('wgScriptPath')
  }
  /** 当前操作类型，`view`为浏览，`edit`为编辑 */
  get action(): 'edit' | 'view' | 'history' | 'delete' | 'protect' {
    return getConfig('wgAction')
  }
  /** 皮肤名 */
  get skin(): string {
    return getConfig('skin')
  }
  /** 用户名，未登录时为`null` */
  get userName(): string | null {
    return getConfig('wgUserName')
  }
  /** 用户Id，未登录时为`null` */
  get userId(): number | null {
    return getConfig('wgUserId')
  }
  /** 用户组，未登录时为`["*"]` */
  get userGroups(): string[] {
    return getConfig('wgUserGroups')
  }
  get wikiId() {
    return getConfig('wgWikiID')
  }
  get apiUrl() {
    const { protocol, host } = location
    return `${protocol}//${host}${getConfig('wgScriptPath')}/api.php`
  }
  /** wiki-salt请求头，不带缓存 */
  get wikiSaltHeader(): Record<string, string> {
    return {
      pragma: 'no-cache',
      'cache-control': 'no-cache',
      'Api-User-Agent': `wiki-salt/${getConfig('wgWikiID')}`,
    }
  }
  /** wiki-salt请求头，有缓存 */
  get wikiSaltHeaderCached(): Record<string, string> {
    return {
      'Api-User-Agent': `wiki-salt/${getConfig('wgWikiID')}`,
    }
  }
}
const WikiConstant = new WikiConstants()
export default WikiConstant
