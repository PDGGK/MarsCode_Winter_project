我开源了一款轻量级前端埋点监控sdk
2023-03-16
30,347
阅读14分钟
智能总结
复制
重新生成
本文介绍了开源的前端监控 sdk“heimdallr-sdk”。阐述了开发该 sdk 的背景，其轻量级、插件化，能不侵入业务代码上报系统状态。介绍了架构、数据流、Core、Client、Plugins、Server、Manager、Tools 等内容，包括各端基座、插件功能、服务端模式、管理后台、脚手架工具及相关插件等，后续考虑出系列详细介绍，刚开源可能有 bug。

关联问题:
如何实现自定义插件
多服务有何优势
监控后台如何部署
基于该文章内容继续向AI提问
前言
本文主要介绍的就是我的开源项目，前端监控 sdk：heimdallr-sdk。篇幅有限，因此本篇文章仅仅是对 sdk 主要模块的简单介绍，后续考虑出个系列，欢迎关注；同时，项目也已开源，欢迎 star ⭐

背景
无论是初创的小公司，还是互联网大厂。只要是能赚钱的业务，那它的前端项目必定是需要监控的。

什么？你们的项目直接果奔？不需要任何监控？

那没事了。

要保持微笑
但是，有木有一种可能，你们一路果奔的前端项目，在不久的将来，出现了本不该出现的 bug，关键这个 bug 还不是你们内部自己发现的，而是客户发现的；然后，你们的线上 bug 数就喜加一了。在你吭哧吭哧地排查问题的时候，你还得反复问客户 “您是怎么操作的？我可以远程看一下吗？（微笑）”，有的客户愿意告诉你，有的客户只会礼貌问候你或者问候一线

开心
不出意外的话，你今天、明天、大后天，甚至下周、下下周，都会陷入深深的自我怀疑中

令人头秃
“为什么，明明没问题啊，怎么回事”

这个时候你就需要一款强大的前端监控了

前端监控已经不是个新鲜玩意儿了，市面上也已经有成熟的监控系统了，强大如 Sentry，但是，它们有一个共同点，那就是

贵

当然贵是相对小项目而言，对于大项目更关注的是安全性以及更多的定制化

同时作为使用方，一旦监控系统出了问题，就会显得比较被动

因此，不如自己动手撸一个前端监控

成品
直接上菜 heimdallr-sdk

一款轻量级、插件化的前端监控 sdk

能够不侵入业务代码并及时上报系统状态（报错、使用情况等）。
为了防止功能过剩，避免引入过多的包，使得整个项目过于臃肿；除了基座是必须引入的，其余 sdk 的功能都将以插件的方式按需引入。
sdk 已经能够覆盖大部分场景，不说全栈吧，至少能覆盖常见的前端场景了，如：浏览器、小程序。
采用了插件化架构，所以容易扩展，允许引入自定义开发的插件，扩展 sdk 的能力
sdk 的引入不需要复杂的配置，初始化时提供一下应用名称、监控服务接口地址即可，其余配置按需调整，配置项少。
提供了 监控管理后台 与 监控服务，可以使用 cli 工具完成快速部署，支持二开
完全开源，不收费
架构
为了实现功能的按需引入与可扩展性，整体采用插件化架构

插件化

如上图，不同端继承自 Core，每个端各自有多种功能的插件，根据需要引入即可

为了能统一工作流，降低项目基建成本，提高团队协作性；项目采用目前主流的 monorepo 方式进行代码管理，即把多个 packages 放在同一仓库中，插件也将作为独立的子包放在 packages 下，统一编译、调试、发布

monorepo
整体架构如下图所示

framework

大致分为：应用接入层、数据存储层、数据服务层、监控平台层

应用接入层即 sdk 的核心部分，负责收集应用信息并上报

数据存储使用的是 Mysql，为了方便操作数据库，额外引入了个 ORM 库

数据服务层、监控平台层后文细说

数据流
这里我实现了两种模式的服务

单服务
该模式下日志的上报、写入，与监控后台日志的读取在同一 node 服务中，如下图

node 服务既负责接收日志，也负责读写数据库

node server

多服务
该模式拆分了“消费服务”与“生产服务”，同时使用了 RabbitMQ 达到削峰填谷的效果，如下图所示

server with rabbitMQ

producer 即生产者，负责接收客户端上报的日志，并推入消息队列。

consumer 也即消费者，从消息队列中读取消息，拼接日志信息，写入数据库中；同时处理监控后台发来的请求，从数据库中读取相应信息，处理后返回给监控后台。

Core
Core 是 SDK 的核心抽象类，完成一些基础的初始化操作，负责提供 SDK 内与平台无关的代码，同时规范各个客户端的属性与方法。

Core 主要做了以下事情

完成 SDK 配置项的初始化与绑定
实现引用插件的功能
使用发布订阅模式完成日志的捕获与上报
统一控制台的输出方法
提供面包屑功能，给各个插件使用（暂不支持手动增加面包屑，可以使用 @heimdallr-sdk/customer 上报）
规范初始化应用方法，各客户端所需的应用信息不一致，因此这里只提供抽象方法，需要各个客户端自己实现
规范数据转换方法，与上一条一样，这里也只提供抽象方法，需要客户端自行实现
规范数据上报方法，因为不同客户端支持的网络请求方式不一致，如：浏览器端有多种网络请求 API 可用，而 wx 只能使用 wx.request 方法发起请求，因此这里也只提供抽象方法，得客户端自己实现
Client
Client 即客户端，也就是在不同平台使用的 sdk 基座

Browser
Browser 即浏览器端的监控基座，以浏览器为载体的应用都可以使用该基座

继承自 Core 抽象类，实现了 Core 中的抽象方法：

初始化应用
数据转换
数据上报：支持 sendBeacon、图片上报、get 三种上报方式，默认使用 sendBeacon
Browser 基座同时内置了错误监控 sdk，以内置插件的方式集成在基座中，可以监听到以下三种类型的错误：

代码错误（支持 sourcemap，需上传 sourcemap 文件）
资源加载错误
代码中未捕获的错误
此外还监听了页面的加载与卸载，作为一次访问会话上报，以页面加载作为会话开始、页面卸载视为会话结束

Browser 基座支持 CDN 与 NPM 两种引入方式，这也就意味着绝大多数技术栈的前端应用都可以使用该基座

CDN 方式引入如下

<script>
    window.__HEIMDALLR_OPTIONS__ = {
        dsn: {
            host: 'localhost:8888',
            init: '/project/init',
            upload: '/log/upload'
        },
        app: {
            name: 'playgroundAPP',
            leader: 'test',
            desc: 'test proj'
        },
        userIdentify: {
            name: '__state__.a.0.user.id', // window.__state__ = { a: [{ user: { id:'123' } }] }
            position: 'global'
        }
    };
</script>
<script async src="/browser-dist/browser.iife.js"></script>
NPM 引入

import heimdallr from "@heimdallr-sdk/browser";
heimdallr({
    dsn: {
        host: 'localhost:8888',
        init: '/project/init',
        upload: '/log/upload'
    },
    app: {
        name: 'playgroundAPP',
        leader: 'test',
        desc: 'test proj'
    },
    userIdentify: {
        name: '__state__.a.0.user.id', // window.__state__ = { a: [{ user: { id:'123' } }] }
        position: 'global'
    }
});
Node
Node 即 nodejs 服务端的监控基座

同样继承自 Core 抽象类，实现了应用初始化、上报数据最后的转换、数据上报三个方法

这里的上报方式使用了第三方库来实现，node-fetch

Node 基座同样默认集成了错误监听的能力，监听了 uncaughtException 的错误并上报

Node 服务端一般不以“会话”为监控维度，更关注接口与服务器性能，因此没有 Browser 中的“会话”的概念

该基座可以通过 NPM 方式引入，与 Browser 引入方式类似

Wx
Wx 即微信小程序的监控基座

老规矩，继承自 Core 抽象类，实现初始化、转换、上报三个方法

同样的，Wx 基座也集成了基础的错误监控，本质上就是重写了 APP.onError，捕获到错误并上报

与 Browser 最大的区别就是如何监听一个完整的会话，这里人为规定以 onShow 为一次会话的开始，以 onHide 为一次会话的结束，同时提供了两种方式去监听会话：

提供 trace 函数，在每个页面的 onShow 与 onHide 方法内手动添加埋点
重写小程序的 Page 方法，返回 heimdallrPage 方法，在页面中直接使用 heimdallrPage 替代 Page 方法
通过 NPM 方式引入，引入方式参考微信官方文档啦

Plugins
当前仅有 Browser 基座与 Wx 基座的插件

篇幅有限，只能罗列一下了，没法一个个单独讲

For Browser
Browser 基座的所有插件均提供 CDN 与 NPM 两种引入方式

@heimdallr-sdk/console
监听浏览器控制台的输出并上报，debug 为 false 时，控制台所有信息都不会打印
@heimdallr-sdk/customer
自动读取存储在 cookie、localStorage、sessionStorage、window 上的数据并上报，同时也可以通过调用 window.HEIMDALLR_REPORT(type: string, data: any) 手动上报
@heimdallr-sdk/dom
监听页面的点击事件并上报
@heimdallr-sdk/fetch
监听页面发起的 fetch 请求，reportResponds 为 true 时，将连同接口返回值一同上报
@heimdallr-sdk/xhr
监听页面发起的 XMLHttpRequest 请求，reportResponds 为 true 时，将连同接口返回值一同上报
@heimdallr-sdk/hash
监听页面路由的 hash 变化，记录来源与跳转地址并上报
@heimdallr-sdk/history
监听页面路由的变化，包括手动点击浏览器按钮的跳转，自动记录来源与跳转地址并上报
@heimdallr-sdk/performance
页面性能监控，可以得到下列性能指标
dnsSearch: DNS 解析耗时
tcpConnect: TCP 连接耗时
sslConnect: SSL 安全连接耗时
request: TTFB 网络请求耗时
response: 数据传输耗时
parseDomTree: DOM 解析耗时
resource: 资源加载耗时
domReady: DOM Ready
httpHead: http 头部大小
interactive: 首次可交互时间
complete: 页面完全加载
redirect: 重定向次数
redirectTime: 重定向耗时
duration
fp: 渲染出第一个像素点，白屏时间
fcp: 渲染出第一个内容，首屏结束时间
fmp: 有意义内容渲染时间
fps: 刷新率
lcp: 最大内容渲染时间，2.5s 内
fid: 交互性能，应小于 100ms
cls: 视觉稳定性，应小于 0.1
resource: 页面资源加载耗时
@heimdallr-sdk/record
录制当前会话所有操作并上报
@heimdallr-sdk/page_crash
监听页面崩溃，需配合 @heimdallr-sdk/page-crash-worker 使用，不走基座的上报与数据转换，在 page-crash-worker 文件中使用 get 方法上报崩溃数据。从命名就能看出来，核心原理就是使用 Worker (狗头)
@heimdallr-sdk/vue
捕获 vue 抛出的错误并上报，支持 sourcemap（需上传 sourcemap 文件）
For Wx
小程序基座的插件较少，但也不太需要那么多，毕竟小程序自己就有一套性能、错误监控；因此，只写了几个常用但小程序没提供的监控插件

@heimdallr-sdk/wx-dom
监听小程序的点击事件，记录触发的函数名以及附带信息并上报
@heimdallr-sdk/wx-request
监听小程序发起的请求，包括 request、downloadFile、uploadFile，同样可通过 reportResponds 配置决定是否上报接口返回结果
@heimdallr-sdk/wx-route
捕获小程序的路由跳转，记录来源、跳转地址与跳转状态（成功与否）并上报
自定义插件
插件本质上就是一个个 Plugin 类型对象

基础的 Plugin 类型如下：

export interface BasePluginType {
  name: string;
  monitor: (notify: (collectedData: any) => void) => void;
  transform?: (collectedData: any) => ReportDataType<any>;
}
name: 当前插件名称（不能写中文）
monitor: 插件逻辑的具体实现放在这个函数体中
notify 函数负责将数据上报，collectedData 还不是最终上报到服务器的数据，会在基座的 transform 内包装一下再上报
transform: 可选配置，即接收 notify 中上报的数据，在这里转换一下；最终也是会到基座的 transform 方法内做最后的“包装”
因此，只需要实现并返回一个符合 BasePluginType 的对象，即可接入到 heimdallr-sdk 的基座中作为插件使用

Server
服务端作为私有子包，不发布，可通过 @heimdallr-sdk/cli 脚手架快速部署

服务端使用 express 作为 Node 服务端框架，ORM 库使用 Prisma，数据库则使用的是 MySQL

正如前面说的，这里我提供了两种服务端，我把它称为“单服务”与“多服务”

“单服务”
“单服务”采用的是传统的 MVC 架构，不过这里默认的 View 不调用 API，而是作为接口文档，方便查阅；也可以修改 route 指向不同的页面

实现的主要功能如下：

项目的初始化（其实就是应用信息入库）
会话的创建与写入
日志信息的接收与写入（同时支持 post 与 get）
应用列表
会话列表
日志列表
接收 sourcemap 文件
解析 sourcemap
“单服务”既负责接收，也负责提供接口给监控后台（Manager）使用，能直接读写数据库

node server

“多服务”
“多服务”将服务端一分为二，分为“消费服务”与“生产服务”

使用 RabbitMQ 完成对流量的削峰填谷

server with rabbitMQ

Producer
“生产服务” 也就是图中的 producer，即生产者，面向监控 SDK，从 SDK 接收上报数据

主要功能如下：

接收应用信息，并推入应用队列
接收日志信息（会话就是两条一前一后的日志），并推入日志队列
接收 sourcemap 文件
Consumer
“消费服务” 也就是上图的 consumer，也即消费者，面向监控后台，提供读取接口给监控后台调用。

主要功能如下：

从应用队列中提取应用消息，写入数据库
从日志队列中提取日志消息，完成日志消息的“组装”，再写入数据库
解析 sourcemap 文件
提供统计数据接口
提供应用/项目列表接口
提供会话列表接口
提供日志列表接口
Manager
Manager 即监控服务的管理后台，私有包，不发布，同样可以通过 @heimdallr-sdk/cli 脚手架工具快速部署

使用了自己写的 Vue3 脚手架 vva-cli 快速开发的，技术栈是 Vue3 + Typescript + Element-Plus，使用 Vite 打包编译

有以下四个模块：

总览

当前仅分析了异常数、异常API、慢页面、慢API 四个维度

总览

应用列表

应用/项目列表

会话

会话列表

会话详情不单开页面，在列表页右侧增加抽屉式弹层展示 会话详情

回放功能需引入 @heimdallr-sdk/record 插件 会话回放

日志

日志列表

同样的，日志详情也不单开页面，在列表页右侧增加抽屉式弹层展示 日志详情

Tools
@heimdallr-sdk/cli
heimdallr-sdk 的脚手架工具

主要作用就是为了能够快速部署“监控服务端”与“监控管理后台”

全局安装脚手架

npm i @heimdallr-sdk/cli
安装完成后输入 heimdallr-create 命令，即可开始选择相应的模板

命令提示行

提供监控后台管理台和监控服务以及带消息队列的监控服务 三类模板

依次完成配置（作答）后，在当前目录下将自动创建项目文件夹

创建成功

三个模板前文已经介绍了，这里就不再赘述了

@heimdallr-sdk/webpack-plugin-sourcemap-upload
这个插件，件如其名（doge），主要功能就是在以 webpack 为构建工具的项目中,自动完成 sourcemap 文件的上传

它将在 webpack 构建完成后，将产出的 sourcemap 文件自动上传到指定服务器

用法也很简单，指定一下初始化 sdk 时使用的应用名称，以及文件上传的接口地址即可

import UploadSourceMapPlugin from "@heimdallr-sdk/webpack-plugin-sourcemap-upload";
const config = {
  plugins: [
    new UploadSourceMapPlugin({
      appname: "playground",
      url: `http://localhost:8001/sourcemap/upload`,
    }),
  ],
  // TODO--
};
@heimdallr-sdk/vite-plugin-sourcemap-upload
这个插件功能同上，不同点在于：上一个插件是针对以 webpack 为构建工具的项目，而这个插件是针对以 vite 为构建工具的项目

同样是在 vite 构建工作完成后，将产出的 sourcemap 文件自动上传到指定服务器

因为 vite 底层其实是使用 rollup 构建，因此，该插件监听的是 writeBundle 和 closeBundle 两个阶段的 hook

用法如下

import sourceMapUpload from "@heimdallr-sdk/vite-plugin-sourcemap-upload";

export default defineConfig({
  plugins: [
    vue(),
    sourceMapUpload({
      appname: "playground",
      url: `http://localhost:8001/sourcemap/upload`,
    }),
  ],
  build: {
    sourcemap: true,
  },
  // TODO--
});
使用时需要注意的是，@heimdallr-sdk/webpack-plugin-sourcemap-upload 对外暴露的是一个类，而 @heimdallr-sdk/vite-plugin-sourcemap-upload 对外暴露的则是一个函数

后记
后续考虑出个系列，再详细写一下实现。刚开源不久，可能还有 bug 👾，欢迎多多提 issue