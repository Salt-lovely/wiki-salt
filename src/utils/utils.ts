/*
 * @Author: Salt
 * @Date: 2022-07-09 13:51:11
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-24 20:16:55
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\utils\utils.ts
 */

import { prefix } from 'src/constant/note'

/**
 * 断言某个状态，如果状态为假则抛出错误
 * @param condition 需要断言的表达式
 * @param msg 报错文案
 */
export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    const errMsg = msg || '发生错误'
    throw new Error(errMsg)
  }
}
/** 当文档准备完毕时调用回调，若文档已经准备完毕，则马上调用回调 */
export function docReady(fn: () => unknown): void {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', fn)
  } else {
    fn()
  }
}
/** 当文档准备完毕时异步调用回调 */
export async function docReadyAsync<T>(fn: () => T) {
  const cb = new Promise<void>((res) => {
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        res()
      })
    } else {
      res()
    }
  })
  await cb
  return fn()
}
/**
 * 返回一个一定时间后解决的Promise，用于异步函数的休眠
 * @param time 休眠时间，默认为500毫秒
 */
export function sleep(time?: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time || 500))
}
/** 用一个对象 */
export function extend<T extends object, K extends Partial<T>>(
  obj: T,
  ext: K,
  force = false
): T {
  for (const key in ext) {
    if (force || !(key in obj)) {
      Object.defineProperty(obj, key, {
        value: ext[key],
        enumerable: false,
      })
    }
  }
  return obj
}
/** 返回一个输出时带prefix的类console方法集 */
export function useConsole(...prefix: any[]) {
  const log = (...data: any[]) => console.log(...prefix, ...data)
  const error = (...data: any[]) => console.error(...prefix, ...data)
  const warn = (...data: any[]) => console.warn(...prefix, ...data)
  const debug = (...data: any[]) => console.debug(...prefix, ...data)
  const info = (...data: any[]) => console.info(...prefix, ...data)
  const clear = () => console.clear()
  return { log, error, warn, debug, info, clear }
}

export const saltConsole = useConsole(prefix)
/**
 * 缩进一段文字
 * @param text 要缩进的文字
 * @param config 缩进配置，默认每行前面加两个空格
 */
export function indent(
  text: string,
  config?: {
    split?: string
    count?: number
    type?: string
    skipBlank?: boolean
  }
) {
  const { split = '\n', count = 2, type = ' ', skipBlank = true } = config || {}
  return text
    .split(split)
    .map((s) => (skipBlank && !s ? s : type.repeat(count) + s))
    .join(split)
}
