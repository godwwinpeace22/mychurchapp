const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Image', new Schema({
    imgSrc:String,
    date:String,
    imgDetail:String,
    fullData:Object,
    index:String
}))