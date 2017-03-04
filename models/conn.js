const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connection.on('connected', () => console.log('mongoose connected!'));
mongoose.connection.on('error', (err) => console.log('mongoose error: ', err));

let db = mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/test');

module.exports = { mongoose: mongoose, db: db };