/*
 * @Author: Salt
 * @Date: 2022-07-09 15:13:33
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-04 20:28:56
 * @Description: 实现基础功能的类
 * @FilePath: \wiki-salt\src\class\SaltOriginalClass.ts
 */
import { saltConsole, assert, sleep } from 'Utils/utils'

const { log } = saltConsole

/**
 * 实现了基础功能，同时会自动检测mw.Api上的方法是否完整
 */
export default class SaltOriginalClass {
  ver: string
  note: string
  /** MediaWiki的API实例 */
  mwApi: mwApi | undefined // 啊啊啊啊这个检查好烦啊（虽然帮忙找错很管用）
  /** 缓存的页面名列表，特殊标记（; ）（一个半角分号+一个空格）隔开 */
  titleList: string = ''
  constructor(ver?: string, note?: string) {
    this.ver = ver || ''
    this.note = note || ''
    this.getMwApi()
    // 检查mw.Api原型的方法
    this.addPlugin()
  }
  /** 获取版本信息 */
  version() {
    log(`\n Version: ${this.ver}\n Author: Salt_lovely\n License: MulanPSL-2.0`)
  }
  /** 获取帮助信息 */
  usage() {
    log(this.note)
  }
  help = this.usage
  /** 获取自己的信息 */
  me() {
    console.log(
      mw.config.get('wgUserName') +
        '; ' +
        (mw.config.get('wgUserId') || '未知UID') +
        '; ' +
        (mw.config.get('wgUserGroups') || ['未知用户组']).join(', ')
    )
  }
  /** 获取mw.Api实例，挂载到this.mwApi */
  async getMwApi() {
    await this.waitMwApi() // 等待mw和mw.Api加载完毕
    this.mwApi = new mw.Api()
    log('已获取mw.Api实例，可以开始工作...')
  }
  /** 等待mw加载完毕 */
  async waitMw() {
    let safe = 0
    while (!window.mw) {
      await sleep(500)
      assert(safe++ < 30, '未检测到 mw ！')
    }
  }
  /** 等待mw和mw.Api加载完毕 */
  async waitMwApi() {
    await this.waitMw()
    let safe = 0
    while (!mw.Api) {
      await sleep(500)
      assert(safe++ < 30, '未检测到 mw ！')
    }
  }

  /** 替换当前页面内容 */
  async pageEdit(props: pageEditProps) {
    const { before, after, sum = '', pageName } = props
    const page: string = pageName || mw.config.get('wgPageName')
    if (!this.pageNameCheck(page) || !this.mwApi) {
      return
    }
    await this.mwApi.edit(page, function (revision: any) {
      return {
        text: revision.content.replace(before, after),
        summary: sum,
        minor: true,
      }
    })
    log('编辑已保存: ' + page)
  }

  /** 批量替换页面内容 */
  async wikiEdit(props: wikiEditProps) {
    //格式化：
    //\s-[^\n]*\n?\s*
    const {
      pages,
      before,
      after,
      sum = '',
      timeInterval = 200,
      sync = false,
    } = props
    const pagelist = typeof pages === 'string' ? pages.split('; ') : pages
    if (pagelist.length < 1) return
    log(`批量编辑 ${pagelist.length} 个页面`)
    for (let i = 0; i < pagelist.length; i++) {
      const page = pagelist[i]
      if (!this.pageNameCheck(page)) continue
      // log(page)
      const summary = `${sum || ''} 第 ${i + 1}/${pagelist.length} 个`
      const editFn = async () => {
        if (!this.mwApi) return
        await this.mwApi.edit(page, function (revision: any) {
          return {
            text: revision.content.replace(before, after),
            summary,
            minor: true,
          }
        })
        log(`第 ${i + 1}/${pagelist.length} 个编辑已保存: ${page}`)
      }
      if (sync) {
        try {
          await editFn()
        } catch (e) {
          log(`第 ${i + 1}/${pagelist.length} 个页面“${page}”保存失败`)
        }
      } else editFn()
      await sleep(timeInterval)
    }
  }

  /**
   * 批量替换titleList缓存列表中的页面内容
   * @param before 被替换的内容，可以用正则表达式
   * @param after 要替换的内容
   * @param timeInterval 替换的时间间隔，推荐 200-300，超过15个时建议 500，超过35个时建议 750，超过50个时建议 1000，超过100个时建议1500
   */
  listEdit(before: string | RegExp, after: string, timeInterval: number) {
    this.wikiEdit({
      pages: this.titleList,
      before,
      after,
      timeInterval,
      sum: '列表替换：替换 “' + before + '” 为 “' + after + '”',
    })
  }

  /**
   * 添加新章节
   * @param header 新章节标题
   * @param text 新章节内容
   */
  async newSection(header: string, text: string) {
    const page: string = mw.config.get('wgPageName')
    // mwApi 属性是mw.Api的实例，异步取得
    if (!this.pageNameCheck(page) || !this.mwApi) return
    await this.mwApi.newSection(page, header, text, {
      summary: `添加新章节“${header}”`,
      minor: true,
    })
    log(`新章节“${header}”已保存到“${page}”`)
  }

  /** 创建新页面 */
  async newPage(props: newPageProps) {
    const { content, pageName, sum } = props
    const page: string = pageName || mw.config.get('wgPageName')
    // mwApi 属性是mw.Api的实例，异步取得
    if (!this.pageNameCheck(page) || !this.mwApi) return
    await this.mwApi.create(page, { summary: sum }, content)
    log(`新页面“${page}”已保存`)
  }

  /**
   * 查询页面内容
   * @param str 查询值
   * @param namespace 查询的命名空间，默认为主命名空间
   * @param limit 查询数量限制
   */
  wikiSearch(
    str: string,
    namespace: string | number = '0',
    limit: string | number = 'max'
  ) {
    this.wikiSearchAndReplace({
      str,
      before: '',
      after: '',
      namespace,
      limit,
      srwhat: 'text',
    })
  }
  /**
   * 查询页面标题
   * @param str 查询值
   * @param namespace 查询的命名空间，默认为主命名空间
   * @param limit 查询数量限制
   */
  wikiSearchTitle(
    str: string,
    namespace: string | number = '0',
    limit: string | number = 'max'
  ) {
    this.wikiSearchAndReplace({
      str,
      before: '',
      after: '',
      namespace,
      limit,
      srwhat: 'title',
    })
  }

  /** 查询，也可以原地替换 */
  wikiSearchAndReplace(props: wikiSearchAndReplaceProps) {
    const {
      str,
      before,
      after,
      namespace = '0',
      limit = 'max',
      timeInterval = 500,
      handle = false,
      srwhat = 'text',
    } = props
    let obj = this
    if (!this.mwApi) return

    const srnamespace = `${
      namespace instanceof Array ? namespace.join('|') : namespace
    }`
    log('搜索中...')
    this.mwApi
      .get({
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: str,
        srlimit: limit + '',
        srnamespace,
        srwhat,
      })
      .done(function (data: any) {
        log('正在处理返回信息...')
        if (
          typeof data.query != 'undefined' &&
          typeof data.query.search != 'undefined'
        ) {
          let res: querySearchArray[] = data.query.search,
            titleList: string[] = []
          for (let x of res) {
            titleList.push(x.title)
          }
          log(titleList)
          obj.titleList = titleList.join('; ')
          if (handle) {
            log('成功获取信息，开始执行替换工作')
            obj.wikiEdit({
              pages: obj.titleList,
              before,
              after,
              timeInterval,
              sum: '搜索替换：搜索“' + before + '” 替换为 “' + after + '”',
            })
          }
        } else {
          log('没有成功获取到信息')
        }
      })
  }

  /** 检查页面名，防止编辑错误的页面 */
  pageNameCheck(pageName: string): boolean {
    if (!pageName) {
      // 没有页面名
      return false
    }
    if (pageName.length < 2) {
      log('页面名太短: ' + pageName)
      return false
    }
    if (/^(特殊|special):/i.test(pageName)) {
      log('特殊页面不能编辑: ' + pageName)
      return false
    }
    if (/^(媒体|media):/i.test(pageName)) {
      log('媒体页面不能编辑: ' + pageName)
      return false
    }
    return true
  }

  /** addPlugin: 给mw.Api的原型添加方法——垫片代码来自官方文档 */
  async addPlugin() {
    await this.waitMwApi() // 等待mw和mw.Api加载完毕
    const mwApiInst = new mw.Api()
    if (typeof mwApiInst.postWithEditToken !== 'function') {
      log('mw.Api原型没有postWithEditToken方法，自动加载...')
      mw.Api.prototype.postWithEditToken = function (p: any, a: any): any {
        return this.postWithToken('csrf', p, a)
      }
    }
    if (typeof mwApiInst.getEditToken !== 'function') {
      log('mw.Api原型没有getEditToken方法，自动加载...')
      mw.Api.prototype.getEditToken = function (): any {
        return this.getToken('csrf')
      }
    }
    if (typeof mwApiInst.create !== 'function') {
      log('mw.Api原型没有create方法，自动加载...')
      mw.Api.prototype.create = function (
        title: string,
        params: any,
        content: any
      ): any {
        return this.postWithEditToken(
          $.extend(
            this.assertCurrentUser({
              action: 'edit',
              title: String(title),
              text: content,
              formatversion: '2',
              createonly: true,
            }),
            params
          )
        ).then(function (data: any) {
          return data.edit
        })
      }
    }
    if (typeof mwApiInst.edit !== 'function') {
      log('mw.Api原型没有edit方法，自动加载...')
      mw.Api.prototype.edit = function (title: string, transform: any): any {
        var basetimestamp: any,
          curtimestamp: any,
          api = this
        title = String(title)
        return api
          .get({
            action: 'query',
            prop: 'revisions',
            rvprop: ['content', 'timestamp'],
            titles: [title],
            formatversion: '2',
            curtimestamp: true,
          })
          .then(function (data: any) {
            var page, revision
            if (!data.query || !data.query.pages) {
              return $.Deferred().reject('unknown')
            }
            page = data.query.pages[0]
            if (!page || page.invalid) {
              return $.Deferred().reject('invalidtitle')
            }
            if (page.missing) {
              return $.Deferred().reject('nocreate-missing')
            }
            revision = page.revisions[0]
            basetimestamp = revision.timestamp
            curtimestamp = data.curtimestamp
            return transform({
              timestamp: revision.timestamp,
              content: revision.content,
            })
          })
          .then(function (params: any) {
            var editParams =
              typeof params === 'object' ? params : { text: String(params) }
            return api.postWithEditToken(
              $.extend(
                {
                  action: 'edit',
                  title: title,
                  formatversion: '2',
                  assert: mw.config.get('wgUserName') ? 'user' : undefined,
                  basetimestamp: basetimestamp,
                  starttimestamp: curtimestamp,
                  nocreate: true,
                },
                editParams
              )
            )
          })
          .then(function (data: any) {
            return data.edit
          })
      }
    }
    if (typeof mwApiInst.newSection !== 'function') {
      log('mw.Api原型没有newSection方法，自动加载...')
      mw.Api.prototype.newSection = function (
        title: string,
        header: any,
        message: any,
        additionalParams: any
      ): any {
        return this.postWithEditToken(
          $.extend(
            {
              action: 'edit',
              section: 'new',
              title: String(title),
              summary: header,
              text: message,
            },
            additionalParams
          )
        )
      }
    }
  }
}
