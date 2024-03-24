/*
 * @Author: Salt
 * @Date: 2022-07-09 13:48:48
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-24 19:24:05
 * @Description: 全局类型定义
 * @FilePath: \wiki-salt\src\global.d.ts
 */
/// <reference path="./codeMirror" />
interface Window {
  we: SaltWikiEditHelper
  SaltWikiEditHelper: SaltWikiEditHelper
}
declare var mw: MediaWiki
interface MediaWiki {
  Api: {
    new (): mwApi
  }
  config: mwConfig
  html: any
  loader: mwLoader
}
interface mwConfig {
  get(selection: string, fallback?: any)
  set(selection: string, value: string)
  exists(selection: string)
  values: any
}
interface mwLoader {
  load(modules: string | string[], type: string): void
  using(
    dependencies: string | string[],
    ready?: unknown,
    error?: unknown
  ): Promise<unknown>
  getState(
    module: string
  ): 'registered' | 'loaded' | 'loading' | 'executing' | 'ready' | 'missing' | 'error'
}
interface mwApi {
  abort()
  assertCurrentUser(query: any): any
  postWithEditToken(params: any, additionalParams?: any)
  getEditToken()
  get(parameters: object, ajaxOptions?: object): JQueryPromise
  create(title: string, params: any, content: any)
  edit(title: string, transform: any)
  newSection(title: string, header: any, message: any, additionalParams: any)
  postWithToken(s: string, params: any, additionalParams: any)
  getToken(s: string)
  watch(pages: string)
  unwatch(pages: string)
}
interface querySearchArray {
  ns: number
  title: string
  pagid: number
  size: number
  wordcount: number
  snippet: string
  timestamp: string
}
