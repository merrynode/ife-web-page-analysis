const Koa        = require('koa');
const views      = require('koa-views');
const serve      = require('koa-static');
const logger     = require('koa-logger')
const bodyParser = require('koa-bodyparser');

const worker     = require('./controller/index');
const router     = require('./routes/index');

const app   = new Koa();
const port  = 8080;

app
    .use(bodyParser())
    .use(serve(__dirname + '/static'))
    .use(views(__dirname + '/views'))
    .use(logger())
    .use(router.routes())


worker(app.listen(port, () => console.log(`app listen to ${port}`)));