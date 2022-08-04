/*
 * @Author: Salt
 * @Date: 2022-08-04 20:37:07
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-04 20:37:10
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\utils\hyper.d.ts
 */
// ======================== h 函数 ========================
type solvableChild = string | boolean | number | Node | undefined | null
type solvableChildren = solvableChild[]
type acceptableChildren =
  | solvableChild
  | solvableChildren
  | (solvableChild | solvableChildren)[]

interface componentFunction<Props extends object | null> {
  (): HTMLElement
  (props: Props): HTMLElement
  (props: Props, ...children: Node[]): HTMLElement
  (props: null, ...children: Node[]): HTMLElement
}

type hyperElementOption<T extends HTMLElement> = Partial<Omit<T, 'style'>> & {
  style?: Partial<CSSStyleDeclaration> | undefined
}

interface hyperFunction {
  // tag => HTMLElement
  <Tag extends keyof HTMLElementTagNameMap>(
    tag: Tag,
    props?: hyperElementOption<HTMLElementTagNameMap[Tag]> | null
  ): HTMLElementTagNameMap[Tag]
  <Tag extends keyof HTMLElementTagNameMap>(
    tag: Tag,
    props: hyperElementOption<HTMLElementTagNameMap[Tag]> | null,
    ...children: acceptableChildren[]
  ): HTMLElementTagNameMap[Tag]
  // fn => HTMLElement 无参数
  (fn: () => HTMLElement): HTMLElement
  (
    fn: (props: null, ...children: Node[]) => HTMLElement,
    props: null,
    ...children: acceptableChildren[]
  ): HTMLElement
  // fn => HTMLElement 有参数
  <Props extends object>(
    fn: (props: Props) => HTMLElement,
    props: Props
  ): HTMLElement
  <Props extends object>(
    fn: (props: Props, ...children: Node[]) => HTMLElement,
    props: Props,
    ...children: acceptableChildren[]
  ): HTMLElement
}
