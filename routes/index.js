const Router = require('../middleware/router');
const Task  = require('../models/task');
const crawl = require('../crawl');

const router = new Router();

module.exports = router;

router.get('/', async function (ctx, next) {
    await ctx.render('index');
})

router.get('/node', async function (ctx, next) {
    await ctx.render('node');
})

router.post('/task', async function (ctx, next) {

    let {keyword, deviceNames, page} = ctx.request.body;
    // 执行抓取任务
    let result = await crawl(keyword, deviceNames, page);
    // 返回抓取结果
    ctx.body = result;
    // 保存结果到数据库, 这里我们用不用await都可以。
    Task.create.apply(Task, result);
})