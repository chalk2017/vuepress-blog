::: center

### 如何使用 github actions 快速构建流程

:::

> 官网地址：[https://docs.github.com/cn/actions](https://docs.github.com/cn/actions)

::: left

##### Github Actions 是干什么用的？

:::

> 具体的解释可以参照官网的说明，我这里举两个例子。
> 场景 1： 一般的项目都有迭代不同的版本，但总会有一个 master 或 dev/pro 的版本做为最新版，一般的情况下，我们会在 github 上开不同的分支来管理，然后用版本号来区分，如下面这种：
> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827141504658-173384996.png)

> 但我们每完成一个固定的版本都需要手动更新到 master 或 dev 分支上，甚至我想再开一个仓库去存放最新版本，那我们也每次都得手动 push 更新。
> 不过这时后我们就可以用 github actions，选择我们要触发的时机（pull 还是 push？以及在哪个分支操作），然后代码上传就可以自动同步。

> 场景 2：github page 是 github 提供给我们通过静态页构建博客的功能，但我们每次都需要本地打包生成静态页然后上传，不过有了 actions 就可以把打包以及上传的动作交给 github，我们只需要新增和更新文章然后同步到 github 即可，甚至都可以直接在 github 仓库中直接修改文章都可以。

> 总结：上面两个例子中，知道通过 actions 可以上传，可以编译打包。不过，我们也可以用 actions 做自动化测试，只要有相应的脚本就可以实现。

::: left

##### Github Actions 实质是什么？

:::

> 简单地说，Actions 就相当于 Github 给你提供了一个 linux，你可以在里面上执行脚本。
> 其实 Github 只是给你创建了一个镜像，供你去执行脚本和命令，等你执行完了镜像会被删除。

::: left

##### Github Actions 脚本怎么写？

:::

> 首先先看一下做为 actions 脚本的 yml 文件

```
 # This is a basic workflow to help you get started with Actions

 name: CI

 # Controls when the action will run. Triggers the workflow on push or pull request
 # events but only for the dev branch
 on:
   push:
     branches: [ dev ]
   pull_request:
     branches: [ dev ]

 # A workflow run is made up of one or more jobs that can run sequentially or in parallel
 jobs:
   # This workflow contains a single job called "build"
   build:
     # The type of runner that the job will run on
     runs-on: ubuntu-latest

     # Steps represent a sequence of tasks that will be executed as part of the job
     steps:
       # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
       - uses: actions/checkout@v2

       # Runs a single command using the runners shell
       - name: Run a one-line script
         run: echo Hello, world!

       # Runs a set of commands using the runners shell
       - name: Run a multi-line script
         run: |
           echo Add other actions to build,
           echo test, and deploy your project.
```

- name:CI 是指定流程的名称是“CI”，当 actions 开始执行的时候，我们点 actions 选项卡切换到 actions 页面就能看到

> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827144549325-1748162259.png)
> 上图中红框的就是这个 name

- on: 指定触发时机，是 push 还是 pull 的时候触发脚本

```
7 on:
8   push:
9     branches: [ dev ]
```

> 这段例子的含义就是当本地的代码 push 到名为 dev 的分支中触发，如果我们不管分支只要 push 就触发可以这么写：

```
 7 on:[push]
```

> 同理 pull 和 push 类似。

- jobs 里面的是脚本列表，脚本与脚本直间通过名字来区分，上面的例子中只有一个脚本，就是 build，也就是说 build 就是脚本名，而 build 里面的就是脚本。
- runs-on：指定宿主环境，我们的脚本要在什么环境下执行，通常是 linux，而且例子中默认给的也是这个 ubuntu

```
　　runs-on: ubuntu-latest
　# github中也给了window和ios系统做为宿主环境
```

- steps：执行的步骤，里面通过 - 来区分它的步骤，name 是步骤名，可以没有，下面的 run 用来运行命令和脚本。
  > 一个 name 下可以写多个 run：

```
30       - name: Run a multi-line script
31         run: echo Add other actions to build,
32         run: echo test, and deploy your project.
```

> 也可以写一个 run: |，下一行开始写多个命令：

```
30       - name: Run a multi-line script
31         run: |
32           echo Add other actions to build,
33           echo test, and deploy your project.
```

> steps 中的脚本，常用的还有 uses，with，env 等关键字。

- steps 中的 uses 关键字和 with 关键字

> uses 用来调用第三方依赖，with 则是这个依赖方法需要的入参。
> 这部分很常用，因为我们在用 actions 的时候大多都会找一些比较成熟的工具（轮子）直接使用，很少会自己写轮子。
> 在下面的案例中，我会详细解释这块。
> 而上面模板例子里的

```
- uses: actions/checkout@v2
```

> 这行代码我们几乎都会用上，它可以获取到我要操作的分支的代码，就是把它 checkout

::: left

##### Github Actions 实现 Github Page 的自动编译打包上传

:::

> 如果上面的解释你有些迷茫的话，做完下面这个，你也会操作 Github Actions 了。
> \*\*\* 说一下 yml 文件，yml 并不是纯脚本，这有点类似于 json 文件，是一种保存键值对数据的文件类型。

- 在 git 工程下先创建一个 .github 文件夹，如下图：

> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827153522336-1510205876.png)
> .github 文件夹和你的 .git 文件夹是在同一个路径下，不过一般.git 文件夹默认是被隐藏的。

- 然后.github 文件夹下在创建一个 workflows 文件夹

> 注意：是 workflows 而不是 workflow ， 也不是 .workflows，起初我在构建的时候就因为名字多一个点和少个 s 始终无法看到到 actions 的页面。

- 再在 workflows 文件夹下创建一个 yml 文件，名字随便起，github 只要能找到 workflows 文件夹，并且下面有 yml 文件就会执行它的脚本，如果有多个，会顺次执行。

> 在这我附上我本地的目录解构，方便参考：
> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827154312331-1214640374.png)

- 以下是 yml 文件的写法，我每行都附上注释，方便理解

```
name: "github actions build and deploy gh-pages" #流程名称
on: [push] #当对当前仓库push代码的时候触发
jobs:
  build-and-deploy: #脚本名称
    runs-on: ubuntu-latest #运行在乌班图linux上
    steps:
      - name: Checkout  #步骤1：checkout
        uses: actions/checkout@v2.3.1 #checkout需要引用的依赖
        with:
          persist-credentials: false #checkout依赖参数：不保存证书
      - name: install and build #步骤2：安装依赖和打包
        run: | #运行下面两行命令
          npm install #安装依赖，当前分支的根目录做为默认目录
          npm run build #打包代码

      - name: Install SSH Client #步骤3：关联ssh私钥
        uses: webfactory/ssh-agent@v0.2.0 #这里调用这个第三方的库，可以直接关联ssh私钥
        with: #下面是参数
          #这里需要通过github的环境参数中获取私钥，并传给这个库，（这是最安全的，git当然不能让用户直接输入私钥内容）
          ssh-private-key: ${{ secrets.DEPLOY_KEY }}

      - name: Deploy #步骤4：把编译好的静态目录上传到gh-pages分支上
        uses: JamesIves/github-pages-deploy-action@3.5.9 #这里调用第三方依赖，用于上传代码到指定分支上
        with:
          SSH: true #是否通过ssh方式
          BRANCH: gh-pages #github pages 默认的分支
          FOLDER: dist #上传文件的目录，我这个目录在根目录下，如果是子目录可以这么写  docs/.vuepress/dist
```

- 上面的脚本中涉及到一个环境变量

```
${{ secrets.DEPLOY_KEY }}
```

> 在 github 上一切与用户隐私相关的，都只有登录账号的本人才能看到，比如说 ssh 公钥私钥，但 actions 想要操作 github 就必须要获取这些认证，所以 github 给 actions 暴露了一些环境变量，而 actions 脚本可以通过\${{xxxx}}的方式来获取环境变量的内容。
> 这里我举个例子:
> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827160628306-349931853.png)

> 在上面的这个仓库中，先选择 settings 选项卡，切换到仓库的设置页面，然后左侧菜单的选择 secrets 进入隐私页面，右侧点 New secret 按钮来创建一个私钥变量，在上图中我已经把私钥创建完了，并且名称是 DEPLOY_KEY，而 DEPLOY_KEY 就是获取私钥的环境变量名称，也就是脚本中的

```
${{ secrets.DEPLOY_KEY }}
```

- 上传默认分支

> Actions 只识别默认分支的 .github/workflows/xxx.yml 脚本，如果脚本不在默认分支下，Actions 则因为无法找到显示初始页面。（这里算是一个坑）
> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827162809628-1507943887.png)
> 如上图，我这里的工作流程在 dev 分支中

> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827162908887-1454022197.png)
> 而 dev 并不是默认分支，默认分支 gh-pages 中并没有.github 文件夹，这时我点击 Actions

> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827163056137-446059296.png)

> 它会显示这个页面，这是初始页面，因为找不到 workflows 所以 github 在引导你创建一个，
> 而一直处在上面这个页面的原因主要是找不到工作流程文件，
> git 会从默认分支下找.github/workflows/_.yml 文件，并且_.yml 是个合法的 yml 脚本，你不能用 json 语法冒充，所以，如果不满足上面这个条件，就会一直显示上图页面。
> 反观如果找到工作流程呢
> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827163737053-704968051.png)

> 就会进入这个画面，而 results 是每次执行的记录。
> 当上面的页面出现，但 results 并没有新增记录，原因就是 on 事件没有触发，on 包括 push 和 pull，那就有可能你的语法写错了。

```
on: [push]  #这里一定要有[]中括号，否则就不会触发。
```

```
on:
  push:
    barnchs: [dev] #这里也要有[]中括号，否则不会触发
```

> 还有一点注意了，yml 文件不支持 // 这种注释，习惯这么写的小伙伴如果在 on 或者之前添加了 //这种注释，因为语法不允许，所以也不会触发脚本。

- 通过 push 代码触发流程执行

> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827164154839-1240694628.png)

> 如果触发了工作流程，脚本就会被执行，如上图就会多出一条记录。其中 update 是你在 commit 后面的注释。点击 update 进入下图
> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827164430192-1290011031.png)

> 这里能看到每个 job 和每个 step，因为只有一个 job 所以左侧菜单只显示一个，右侧则是按顺序执行每个 step。step 可以展开看到详细的信息，如下图：
> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827164602523-1458679203.png)

> 这些信息方便我们查看错误。
> 最后附上一个执行成功的图片，以供参考：

> ![来自冉夜博客园](/vuepress-blog/picture/page/articles/github_action_start/1145671-20200827165252314-1749126849.png)

> 本文作者： 冉夜
> 本文链接：https://www.cnblogs.com/wujianbufengsao/articles/13572397.html
> 版权声明：本作品采用知识共享署名-非商业性使用-禁止演绎 2.5 中国大陆许可协议进行许可。
