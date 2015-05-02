/**
 * Created by mishrab on 4/28/15.
 */
var mongoose = require('mongoose');
var imgModel = mongoose.model('imgDownloader',{
    original_url:{
        type: String,
        required: true
    },
    img_url :{
        type: String,
        required: true
    },
    uuid:{
        type: String,
        required: true
    }
});
module.exports = imgModel;