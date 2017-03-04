/**
 * Created by merry on 2017/3/3.
 */
const io = require('socket.io')();

const crawl = require('../crawl');
const Task = require('../models/task');

module.exports = function (app) {
    const socket = io.attach(app);
    const task = socket.of('/worker');

    task.on('connection', function (s) {
        s.on('task', async function ({keyword, deviceNames, limit}) {
            try {
                let taskLog = Symbol(`task [${keyword}, ${deviceNames}, ${limit}]`);
                console.time(taskLog);
                // todo 类型检查
                if (!keyword && !deviceNames && !limit) {
                    return console.info('Is bad param!');
                }

                for (let i = 0; i < deviceNames.length; i++) {
                    let deviceName = deviceNames[i];
                    let result = await crawl(keyword, deviceName, limit);
                    s.emit('done', result);
                    Task.create(result);
                }
                console.timeEnd(taskLog);

            } catch (err) {
                console.error(err);
                s.emit('err', err.message);
            }
        })
    })
}