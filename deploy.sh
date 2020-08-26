#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://chalk2017.github.io
# git push -f git@github.com:chalk2017/chalk2017.github.io.git master

# 如果发布到 https://chalk2017.github.io/vuepress-blog
# 发布到github page中必须指定branch是gh-page
git push -f git@github.com:chalk2017/vuepress-blog.git master:gh-pages

cd -
