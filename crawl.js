const createPhantomPool = require('phantom-pool').default;
const fs = require('fs');
const request = require('superagent');
const queryString = require('querystring');

const deviceList = require('./device_list.json'); // 加载设备配置

// 导出 task 函数
module.exports = task;

// Returns a generic-pool instance
const pool = createPhantomPool({
    max: 5,
    min: 2,
    idleTimeoutMillis: 30000,
    maxUses: 50,
    validator: () => Promise.resolve(true),
    testOnBorrow: true,
    phantomArgs: [['--ignore-ssl-errors=true', '--disk-cache=true'], {
        logLevel: 'error',
    }],
})

/**
 * @name downloadPic
 * @description 下载图片
 * @param link      {String} 图片链接
 *
 * @return picName {String}
 * */
function downloadPic(link) {
    return new Promise((resolve, reject) => {
        let picName = `${Math.random().toString(36).substr(2)}${Date.now()}.jpg`;
        request.get(link)
            .pipe(fs.createWriteStream(`${process.cwd()}/static/pic/${picName}`))
            .on('close', () => resolve(`${picName}`));
    })
}

/**
 * @name task
 * @description 按关键字和设备配置抓取页面
 * @param keyword       {String} 关键字
 * @param deviceName    {Object} 设备配置对象 可选参数
 * @param limit   {Number} 要抓取的页数
 *
 * @return {Object} 抓取结果
 * */
async function task(keyword, deviceName, limit = 1) {
    let device = deviceList[deviceName];
    let searchURL = `https://www.baidu.com/s?wd=${keyword}`;

    return pool.use(async(instance) => {
        try {

            const page = await instance.createPage();

            let startTime = Date.now(); // 记录抓取开始时间

            const status = await page.open(searchURL);

            if (status !== 'success') throw Error({message: '打开页面失败!'});
            // 检测是否为正确的设备配置
            if (device) {
                // 设置 User-Agent
                page.setting('userAgent', device['userAgent']);
                // 设置宽高
                page.property('viewportSize', {
                    width: device.width,
                    height: device.height,
                })
            }

            let dataList = [];  // 信息列表

            await new Promise(async(resolve, reject) => {

                page.on('onUrlChanged', async(targetUrl) => {

                    if (targetUrl === 'about:blank') return;

                    let query = queryString.parse(targetUrl.match(/\?(.*)/)[1]);
                    let pagination = query.pn / 10 + 1;                                  // 当前页数

                    console.log(`当前关键字[${query.wd}], 第[${pagination}]页， 设备名[${device.name}]`);

                    let _dataList = await extractDate();
                    Array.prototype.push.apply(dataList, _dataList);

                    if (limit > pagination) {
                        await wait(1000);
                        await goNextPage();
                    } else if (limit == pagination) {
                        await instance.exit();
                        resolve();
                    } else {
                        reject({url: targetUrl, query: query});
                    }
                })

                let _dataList = await extractDate();
                Array.prototype.push.apply(dataList, _dataList);
                limit > 1 ? await goNextPage() : resolve();
            })

            // 下载缩略图到本地，并生成唯一图片名
            for (let i = 0; i < dataList.length; i++) {
                dataList[i].picName = dataList[i].pic ? await downloadPic(dataList[i].pic) : '';
            }

            let result = {
                code: 1,
                msg: '抓取成功',
                word: keyword,
                device: device,
                time: Date.now() - startTime,
                dataList: dataList
            }

            return result;

            // 提取页面数据
            function extractDate() {
                return page.evaluate(function () {
                    return $('#content_left .result.c-container').map(function () {
                        var info = {};
                        info.title = $(this).find('.t').text() || '';
                        info.link = $(this).find('.t > a').attr('href') || '';
                        info.info = $(this).find('.c-abstract').text() || '';
                        info.pic = $(this).find('.general_image_pic img').attr('src') || '';
                        return info;
                    }).toArray();
                })
            }

            // 延时
            function wait(ms) {
                return new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                })
            }

            // 下一页
            function goNextPage() {
                return page.evaluate(function () {
                    $('#page .n:contains(下一页)').click();
                });
            }
        } catch (err) {
            instance.exit();
            console.error(err);
            return {code: 0, msg: 抓取失败, err: err.message};
        }
    })
}