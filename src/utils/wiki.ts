/*
 * @Author: Salt
 * @Date: 2022-08-04 21:33:49
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-07 18:28:43
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\utils\wiki.ts
 */
import { confirmModal } from 'Components/Modal'
import { alarm } from 'Components/notice'
import WikiConstant from 'src/constant/wiki'
import { getMwApi } from 'src/init/api'
import { saltConsole } from './utils'

type queryParams = { [key: string]: string | number | null | undefined }
type postParams = { [key: string]: any }

interface apiHttp {
  get(params: queryParams): Promise<any>
  get(params: queryParams, type?: 'json'): Promise<any>
  get(params: queryParams, type?: 'text'): Promise<string>
  get(params: queryParams, type?: 'raw'): Promise<Response>
  post(params: postParams): Promise<any>
  post(params: postParams, type?: 'json'): Promise<any>
  post(params: postParams, type?: 'text'): Promise<string>
  post(params: postParams, type?: 'raw'): Promise<Response>
}

const wsHeader = {
  pragma: 'no-cache',
  'cache-control': 'no-cache',
  'Api-User-Agent': `wiki-salt/${WikiConstant.wikiId}`,
}

export const wikiHttp: apiHttp = {
  get: async (params: queryParams, type?: string) => {
    const requestUrl = new URL(WikiConstant.apiUrl)
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) requestUrl.searchParams.append(key, `${value}`)
    }
    const res = await fetch(requestUrl, {
      method: 'GET',
      credentials: 'same-origin',
      headers: wsHeader,
    })
    if (!type || type === 'json') return res.json()
    if (type === 'text') return res.text()
    return res
  },
  post: async (params: postParams, type?: string) => {
    const requestUrl = new URL(WikiConstant.apiUrl)
    const data = new FormData()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) data.append(key, value)
    }
    const res = await fetch(requestUrl, {
      method: 'POST',
      body: data,
      credentials: 'same-origin',
      headers: wsHeader,
    })
    if (!type || type === 'json') return res.json()
    if (type === 'text') return res.text()
    return res
  },
}
const parseFailedFallback = (pageTitle: string) =>
  `<div>${pageTitle}解析失败</div>`
export async function parseWikiText(props: {
  wikitext: string
  title?: string
}): Promise<string> {
  const { wikitext, title: pageTitle } = props
  const title = pageTitle ?? WikiConstant.currentPageName
  try {
    const response = await wikiHttp.post({
      format: 'json',
      action: 'parse',
      text: wikitext,
      title,
      pst: 'true',
    })
    if (response.parse && response.parse.text) {
      return response.parse.text['*'] || ''
    }
    return parseFailedFallback(title)
  } catch (e) {
    saltConsole.error(`${title}页面解析失败`, e)
    alarm(`${e}`, `${title}页面解析失败`)
    return parseFailedFallback(title)
  }
}
/** 获取某一页的源代码 */
export async function getWikiText(props: { section?: string; title: string }) {
  const { title, section } = props
  try {
    const res = await await fetch(
      `//${location.host}${WikiConstant.scriptPath}/index.php?title=${title}${
        section ? `&section=${section}` : ''
      }&action=raw`,
      {
        method: 'GET',
        headers: wsHeader,
      }
    )
    if (!res || Number(res.status) > 299) {
      throw new Error('失败代码' + res.status)
    }
    return res.text()
  } catch (e) {
    saltConsole.error('获取源代码信息失败', e)
    alarm(`${e}`, `${title}源代码获取失败`)
    return false
  }
}
/** 提交更改，若传入原始代码`originWikitext`将自动检查冲突问题 */
export async function postEdit(props: {
  section?: string
  sectionTitle?: string
  title: string
  originWikitext?: string
  wikitext: string
  minor?: boolean
  summary?: string
}) {
  const { title, section, originWikitext } = props
  const mwApi = getMwApi()
  if (originWikitext) {
    // 对比一下最新版和旧版的区别
    const currentWikitext = await getWikiText({ title, section })
    if (currentWikitext !== originWikitext) {
      const isConfirm = await confirmModal(
        '发现编辑冲突，您编辑的版本与页面的当前版本不同，执意提交可能覆盖别人的编辑，您确定要继续吗？'
      )
      if (!isConfirm) return false
    }
  }
  const { sectionTitle, wikitext, summary, minor = false } = props
  const res = await mwApi.postWithEditToken({
    action: 'edit',
    formatversion: '2',
    assert: WikiConstant.userName ? 'user' : undefined,
    nocreate: true,
    title,
    section,
    text: wikitext,
    minor,
    summary:
      summary ||
      (section && sectionTitle
        ? `编辑“${title}”的“${sectionTitle}”章节 // 维基盐编辑器`
        : `编辑“${title}” // 维基盐编辑器`),
  })
  console.log(res)
  return res
}
