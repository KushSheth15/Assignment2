const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/StudDB');
var db = mongoose.connection;

db.on('error', () => {
    console.log('Error...');
});
db.on('connected', () => {
    console.log('Connected...');
});

var studentSchema = mongoose.Schema({
    rno: Number,
    name: String,
    age: Number,
    password: String,
    pic: String
});

var student = mongoose.model('myStudent', studentSchema);
module.exports = student;