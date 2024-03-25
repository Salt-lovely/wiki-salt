<!--
 * @Author: Salt
 * @Date: 2022-07-10 00:22:02
 * @LastEditors: Salt
 * @LastEditTime: 2024-03-24 16:17:17
 * @Description: 说明文档
 * @FilePath: \wiki-salt\README.md
-->
# WikiSalt

![jsDeliver统计数据](https://data.jsdelivr.com/v1/stats/packages/gh/Salt-lovely/wiki-salt/badge)

## WikiSalt 维基盐

WikiSalt（维基盐）编辑工具是盐酱制作的一款MediaWiki条目快速编辑软件，不依赖jQuery。

此工具旨让用户无需跳转编辑页面即可快速编辑、预览、提交，提高维护效率。

## 主要功能

1. 快速编辑功能，无需打开新页面即可编辑。页面顶部的编辑条目按钮右侧、每个章节的编辑按钮右侧均会出现一个“盐编辑”按钮，点击将打开一个模态框，左侧为页面代码，右侧为页面预览。
此功能同样存在于类似的软件中（如[WikiPlus](https://github.com/Wikiplus/Wikiplus)、[InPageEdit](https://github.com/inpageedit/inpageedit-v2)），使用方式大同小异故此不做赘述。
2. 快速更改重定向功能，您可以在Wiki的双重重定向报告页面（`Special:DoubleRedirects`）看到“快速重定向”按钮。

## 安装使用

### 安装

您可以下载打包后的代码，然后使用油猴、暴力猴等浏览器插件加载，或者在您的Wiki个人JS页面（`User:[您的Wiki名]/common.js`）写入如下代码：

```JS
mw.loader.load('https://cdn.jsdelivr.net/gh/Salt-lovely/wiki-salt/build/index.min.js')
```

### 安装环境

需要使用支持ES2017的浏览器，且MediaWiki版本1.28以上方可正常使用本工具。

本工具中有部分功能需要MediaWiki安装对应拓展方可使用：

1. CodeMirror编辑器功能：需要安装CodeMirror拓展

### 使用

## 一起建设

如果您不了解如何编写代码，您可以选择可以[提交工单](https://github.com/Salt-lovely/wiki-salt/issues)，描述您遇到的问题或者想实现的功能，越详细越好（特别是遇到问题的时候，最好附上能够重现问题的流程）。

如果您擅长编码，您可以依此流程在本地编译代码（编译后的代码在`dist/index.js`中）：

```bash
# 安装依赖
yarn
# 启动EsBuild
yarn watch
```

## 语言

目前仅简体中文。

## 隐私

本工具不会收集**任何**个人数据，您的配置储存于浏览器缓存`localStorage`中。

## 其他

迁移了我之前的作品[salt-wiki-editor](https://github.com/Salt-lovely/salt-wiki-editor)的大部分功能
