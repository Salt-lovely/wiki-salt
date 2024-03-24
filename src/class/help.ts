const helpNote: saltWikiHelpNote = {
  basic: `欢迎使用维基盐控制台脚本，本页面已经挂载了一个 we 对象，实例化自 SaltWikiEditHelper 类，使用 we.help() 来查看使用说明

如果您是前端开发者，也可以使用以下方式新建一个脚本实例
// const 新的控制台脚本 = new SaltWikiEditHelper()`,
  short: 'we',
  methods: [
    {
      name: 'wikiReplace',
      params: [
        {
          name: 'pages',
          desc: '页面名集合。可以是一个数组；或是一个长字符串，用特殊标记（; ）（一个半角分号+一个空格）隔开，默认为空',
        },
        {
          name: 'before',
          type: '字符串或者正则表达式',
          desc: '被替换的内容，可以用正则表达式，默认为添加到行尾',
        },
        { name: 'after', desc: '要替换的内容，默认为空' },
        {
          name: 'timeInterval',
          desc: '每次替换的时间间隔，单位毫秒，推荐 200-300，超过15个 500，超过35个 750，超过50个 1000，超过100个 1500，默认为 500',
        },
      ],
    },
    {
      name: 'wikiAppend',
      params: [
        {
          name: 'pages',
          desc: '页面名集合。可以是一个数组；或是一个长字符串，用特殊标记（; ）（一个半角分号+一个空格）隔开，默认为空',
        },
        { name: 'content', desc: '要添加到页尾的内容' },
        { name: 'timeInterval', desc: '替换的时间间隔，单位毫秒，推荐值同上' },
      ],
    },
    {
      name: 'wikiPrepend',
      params: [
        {
          name: 'pages',
          desc: '页面名集合。可以是一个数组；或是一个长字符串，用特殊标记（; ）（一个半角分号+一个空格）隔开，默认为空',
        },
        { name: 'content', desc: '要添加到页首的内容' },
        { name: 'timeInterval', desc: '替换的时间间隔，单位毫秒，推荐值同上' },
      ],
    },
    {
      name: 'pageReplace',
      params: [
        {
          name: 'before',
          type: '字符串或者正则表达式',
          desc: '被替换的内容，可以用正则表达式，默认为添加到行尾',
        },
        { name: 'after', desc: '要替换的内容，默认为空' },
      ],
    },
    {
      name: 'pageReplaceAll',
      params: [{ name: 'content', desc: '将页面整个替换为这个内容' }],
    },
    {
      name: 'pageAppend',
      params: [{ name: 'content', desc: '要添加到页尾的内容' }],
    },
    {
      name: 'pagePrepend',
      params: [{ name: 'content', desc: '要添加到页首的内容' }],
    },
    { name: 'searchMain', desc: '搜索主名字空间', params: [] },
    { name: 'searchUserpage', desc: '搜索用户名字空间', params: [] },
    { name: 'searchProject', desc: '搜索项目名字空间', params: [] },
    { name: 'searchFile', desc: '搜索文件名字空间', params: [] },
    { name: 'searchMediaWiki', desc: '搜索MediaWiki名字空间', params: [] },
    { name: 'searchTemplate', desc: '搜索模板名字空间', params: [] },
    { name: 'searchHelp', desc: '搜索帮助名字空间', params: [] },
    { name: 'searchCategory', desc: '搜索分类名字空间', params: [] },
    { name: 'searchWidget', desc: '搜索Widget名字空间', params: [] },
    { name: 'searchGadget', desc: '搜索Gadget名字空间', params: [] },
    { name: 'me', desc: '输出自己的用户名、UID、用户组', params: [] },
    { name: 'help', desc: '详细教程', params: [] },
  ],
}
export default helpNote
