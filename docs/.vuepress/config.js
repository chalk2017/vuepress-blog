const base = 'vuepress-blog'
module.exports = {
    base: `/${base}/`,
    head: [ // <head>标签里的内容
        ['link', {
            rel: 'icon',
            href: `/assets/img/ranye.png`
        }],
        ['link', {
            rel: 'stylesheet',
            href: '/style.css'
        }]
    ],
    title: '无剑不风骚',
    description: '冉夜不再写代码了~',
    plugins: [
        [
            'vuepress-plugin-clean-urls', // 精简路由url后缀名
            {
                normalSuffix: '', //  page/article.html => page/article
                // indexSuffix: '/', // page/index.md => page
                notFoundPath: '/404.html',
            },
        ]
    ],
    markdown: {
        lineNumbers: true // 代码行号
    },
    // theme: "vknow", // npm仓库中加载主题
    // theme: require.resolve('../../theme'), // 开发目录中加载主题
    themeConfig: { //默认主题配置
        logo: `/assets/img/ranye.png`, //导航菜单的logo，默认public目录
        nav: [{ //导航菜单配置
                text: 'Home',
                link: '/'
            },
            {
                text: 'Page',
                link: '/page/'
            },
            {
                text: 'Arts',
                ariaLabel: '文章列表',
                items: [{
                    text: 'Chinese',
                    link: '/page/article'
                }]
            },
            {
                text: 'External',
                link: 'https://google.com'
            },
        ]
    },
    dest: './dist', // 指定 vuepress build 的输出目录。默认.vuepress/dist
    temp: './.temp', //指定客户端文件的临时目录，默认：/path/to/@vuepress/core/.temp
    host: 'localhost', //dev模式调试ip
    port: 9000 //dev模式调试端口
}