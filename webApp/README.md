##项目介绍：

此项目共有两个html页面

login 是登录页面，引用的js 都在 login 文件夹中

index 是主页面，所有的功能模块都在这个页面


项目采用单页面的形似，除了登录页面外，其余的都在index中


##文件夹介绍：

comm 公用的样式，图片，脚本，插件，都在此文件夹中

console 控制台模块代码

libs index页面用到的插件

login 登录页用到的代码

node_modules 安装的构建插件

projects 项目模块的代码

router 路由，页面的起始页

todo 代办模块的代码

fis-conf.js fis3构建配置

map.json fis3 构建清单

package.json 构建工具依赖清单

topNav 头部导航

##本项目采用fis3 构建

拉取项目后

一：先执行 npm install 安装需要的构建插件  （npm 需要安装node，未安装需要安装）

二：执行命令 fis3 release 构建代码

三：fis3 server start 启动服务

四： fis3 release -w 监听代码改变构建改变部分，且自动刷新浏览器

注意：执行 fis3 release -w 在IE8 下 livereload.js 会报错，这是fis3 自动监听的问题，如果要在IE8 下查看，不要执行此命令

      切记模块间相互依赖！！！，遇到公共的部分抽取出来。


##入口：

router/index.js

所有文件都是按需加载，除非公共文件，是放在页面上引用的

打包结果：每个模块最后产生的只有一个css 和 一个js 文件


##其他：

此项目可以写 css 或者 less ， es5 或者 es6 ，引用的地方 直接引用 less 或者es6 构建的时候会自动处理

为了解决es6不支持方法，会引入 es5-sham/shim 但是，这也只是部分


经过测试：es6 有些特性进过babel编译还是会有问题 如 Array.from  一般的可以使用，使用es6 必须在IE8中测试



##问题：

一：合并文件的时候，依赖问题 ？ （如：a.js 需要在b.js 后面引用 结果合并的时候 a.js在b.js上面）

解决方案：在顶部加载你依赖的文件，打包的时候会自动解决

/**
 * @require /comm/js/comm.js
 */


二：backbone.view 扩展直接 append 到页面，有时有发生数据重复现象

解决方案：不要直接append到某个元素下，用 this.$el.html 的方式可以解决


三：发布版本问题：
1：fis-conf.js 修改 v 版本 同时 在 comm/js/comm.es6 的settings中 修改v 与 fis-conf.js中的一样

四：当监听一个collection的时候，重复渲染，监听会一直存在，并不会，取消

   解决方案：一：使用同一view，实例化成 全局的一个view，不用二次生成

             二：在 addone 中 去判断，如果当前的view的closest body 不存在 则 移除当前的view

四：模板中绑定data

	<% var stringDate= JSON.stringify(cVersion); %>

	 <div class="item" data-version="<%- stringDate %>">

五：API
    folder update: doc/1184353172858304/1184353172858304/file/data?t=1507778538370