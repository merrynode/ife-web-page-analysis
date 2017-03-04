const { db, mongoose } = require('./conn');

const taskSchema = new mongoose.Schema({
    code: { type: String },
    msg: { type: String },
    word: { type: String },
    time: { type: Number },
    dataList: [{}]
})

module.exports = db.model('task', taskSchema);