/*
 * @Author: Salt
 * @Date: 2022-07-09 16:09:27
 * @LastEditors: Salt
 * @LastEditTime: 2022-07-24 00:01:29
 * @Description: 这个文件的功能
 * @FilePath: \salt-wiki-editor\src\class\salt.d.ts
 */
interface defaultEditConfig {
  /** 被替换的内容，可以用正则表达式 */
  before: string | RegExp
  /** 要替换的内容 */
  after: string
  /** 提交编辑时的摘要 */
  sum?: string
}
interface timeInterval {
  /** 替换的时间间隔，推荐 200-300，超过15个时建议 500，超过35个时建议 750，超过50个时建议 1000，超过100个时建议1500 */
  timeInterval?: number
}
/** pageEdit 替换当前页面内容方法的参数 */
interface pageEditProps extends defaultEditConfig {
  /** 非必输，如果没有就默认是当前页 */
  pageName?: string
}
/** wikiEdit 批量替换页面内容方法的参数 */
interface wikiEditProps extends defaultEditConfig, timeInterval {
  /** 页面名集合，用特殊标记（; ）（一个半角分号+一个空格）隔开 */
  pages: string | string[]
  /** 是否在上一条结束后再提交下一个编辑 */
  sync?: boolean
}
interface newPageProps {
  content: string
  sum?: string
  pageName?: string
}
/** wikiSearchAndReplace 批量替换页面内容方法的参数 */
interface wikiSearchAndReplaceProps extends defaultEditConfig, timeInterval {
  /** 查询值 */
  str: string
  /** 查询的命名空间，默认为主命名空间 */
  namespace: string | number | Array<number> | Array<string>
  /** 查询数量限制 */
  limit?: string | number
  /** 若为是，则根据输入的其他信息开始替换 */
  handle?: boolean
  /** 搜索方向，text-内容，title-标题 */
  srwhat?: 'text' | 'title'
}
