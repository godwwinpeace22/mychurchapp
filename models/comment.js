const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Comment', new Schema({
    name:String,
    email:String,
    comment:String,
    sermonRef:String,
    date:String,
    index:Number
}))