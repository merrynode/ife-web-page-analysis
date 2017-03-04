### 百度前端学院-网页抓取分析
[任务地址](http://ife.baidu.com/course/detail/id/89)
#### 项目依赖
后端
* [`phantom-pool`](https://www.npmjs.com/package/phantom-pool)
* [`node.js v7.6`](http://nodejs.org/)
* [`socket.io`](http://socket.io/docs)
* [`koa2`](http://koajs.com)
* [`mongoose`](http://www.mongoose.com/)
* [`koa-views`](https://www.npmjs.com/package/koa-views)
* [`koa-static`](https://www.npmjs.com/package/koa-static)
* [`koa-bodyparser`](https://www.npmjs.com/package/koa-bodyparser)
* [`koa-logger`](https://www.npmjs.com/package/koa-logger)

前端
* [socket.io-client](https://github.com/socketio/socket.io-client)
* [vue2](https://cn.vuejs.org/)
* [bootstrap](http://www.bootcss.com/)

部署
* [pm2](pm2.keymetrics.io/)

安装依赖包
```
yarn install
```
运行【node版本在7.6以下需要加上 `--harmony`，版本过低不支持 `async/await` 】
```
node app
```