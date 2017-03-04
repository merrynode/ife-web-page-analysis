var socket = io('/worker');
socket.on('connect', function () {
    console.log('connect')
});
socket.on('event', function (data) {
});
socket.on('disconnect', function () {
});

var test = new Vue({
    el: '#test',
    data: {
        keyword: 'ife',
        deviceNames: [{
            name: 'iPhone5', select: true
        }, {
            name: 'iPhone6', select: false
        }, {
            name: 'iPad', select: false
        }],
        limit: 1,
        progress: 0,
        finish: 0,
        dataList: []
    },
    methods: {
        test: function () {
            var taskList = this.getTask();
            this.progress += taskList.length;
            socket.emit('task', {keyword: this.keyword, deviceNames: taskList, limit: this.limit});
        },
        add: function (data) {
            var thisDataList = this.dataList;
            this.progress--;
            this.finish++;
            let info = data.dataList.map(function (d) {
                d.deviceName = data.device.name;
                d.path = d.picName && '/pic/' + d.picName;
                return d;
            })
            thisDataList.push.apply(thisDataList, info);
        },
        getTask: function () {
            return this.deviceNames.filter(function (device) {
                return device.select
            }).map(function (device) {
                return device.name
            });
        }
    }
})

socket.on('done', test.add);