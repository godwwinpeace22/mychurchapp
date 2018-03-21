const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Sermon', new Schema({
    index:Number,
    link:String,
    title:String,
    date:String,
    by:String,
    txt:String,
    category:String,
    bibleTxt:String,
    service:String,
    series:String,
    imgSrc:String,
    fullData:Object
}));