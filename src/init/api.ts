import { sleep, saltConsole, assert } from 'Utils/utils'

const { log } = saltConsole

let mwApi: mwApi
export async function apiInit() {
  log('正在初始化')
  await asyncGetMwApi()
  addPlugin()
}

export function getMwApi() {
  assert(mwApi, '未检测到 mediaWiki Api')
  return mwApi
}
/** 获取mw.Api实例 */
async function asyncGetMwApi() {
  await waitMwApi() // 等待mw和mw.Api加载完毕
  mwApi = new mw.Api()
  // log('已获取mw.Api实例，可以开始工作...')
}
/** 等待mw加载完毕 */
async function waitMw() {
  let safe = 0
  while (!window.mw) {
    await sleep(500)
    assert(safe++ < 30, '未检测到 mediaWiki')
  }
}
/** 等待mw和mw.Api加载完毕 */
async function waitMwApi() {
  await waitMw()
  let safe = 0
  while (!mw.Api) {
    await sleep(500)
    assert(safe++ < 30, '未检测到 mediaWiki Api')
  }
}

/** 给mw.Api的原型添加方法——垫片代码来自官方文档 */
function addPlugin() {
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
