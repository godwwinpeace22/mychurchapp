const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('User', new Schema({
    name:String,
    username:String,
    phone:Number,
    email:String,
    password:{type:String,bcrypt: true},
    currQuestNo:Number,
    latestScore:Number,
    startTime:Number,
    currTime:Number
}));