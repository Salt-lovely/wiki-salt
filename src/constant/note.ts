/*
 * @Author: Salt
 * @Date: 2022-07-09 15:17:48
 * @LastEditors: Salt
 * @LastEditTime: 2022-08-04 20:32:57
 * @Description: 这个文件的功能
 * @FilePath: \wiki-salt\src\constant\note.ts
 */
export const helpNote = `
复制粘贴到浏览器的控制台（或油猴脚本）
    Ctrl+A 全选 Ctrl+C 复制 Ctrl+V 粘贴
    如果是油猴脚本，则需要设置只在使用了MediaWiki的网站启用
使用如下代码实例化：
    如果是油猴脚本同时没报错的话，那就已经实例化了一个 we
    // const we = new SaltWikiEditHelper()
常用方法：
    we.wikiReplace(pages, before, after, timeInterval)
        pages 一个长字符串，页面名集合，用特殊标记（; ）（一个半角分号+一个空格）隔开，默认为空
        before 被替换的内容，可以用正则表达式，默认为添加到行尾
        after 要替换的内容，默认为空
        timeInterval 每次替换的时间间隔，单位毫秒，推荐 200-300，超过15个 500，超过35个 750，超过50个 1000，超过100个 1500，默认为 500
    we.wikiAppend(pages, content, timeInterval)
        pages 一个长字符串，页面名集合，用特殊标记（; ）（一个半角分号+一个空格）隔开，默认为空
        content 要添加到页尾的内容
        timeInterval 替换的时间间隔，单位毫秒，推荐值同上
    we.wikiPrepend(pages, content, timeInterval)
        pages 一个长字符串，页面名集合，用特殊标记（; ）（一个半角分号+一个空格）隔开，默认为空
        content 要添加到页首的内容
        timeInterval 替换的时间间隔，单位毫秒，推荐值同上
    we.pageReplace(before, after)
        before 被替换的内容，可以用正则表达式，默认为添加到行尾
        after 要替换的内容，默认为空
    we.pageReplaceAll(content)
        content 将页面整个替换为这个内容
    we.pageAppend(content)
        content 要添加到页尾的内容
    we.pagePrepend(content)
        content 要添加到页首的内容
    we.searchMain(搜索内容)
        搜索主名字空间
    we.searchUserpage(搜索内容)
        搜索用户名字空间
    we.searchProject(搜索内容)
        搜索项目名字空间
    we.searchFile(搜索内容)
        搜索文件名字空间
    we.searchMediaWiki(搜索内容)
        搜索MediaWiki名字空间
    we.searchTemplate(搜索内容)
        搜索模板名字空间
    we.searchHelp(搜索内容)
        搜索帮助名字空间
    we.searchCategory(搜索内容)
        搜索分类名字空间
    we.searchWidget(搜索内容)
        搜索Widget名字空间
    we.searchGadget(搜索内容)
        搜索Gadget名字空间
    we.me()
        输出自己的用户名、UID、用户组
    we.help()
        详细教程`

export const prefix = '[wiki-salt]'
