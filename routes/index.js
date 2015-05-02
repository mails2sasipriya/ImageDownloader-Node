var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var async = require('async');
var fs = require('fs');
var uuid = require('uuid');
var imgModel = require('../models/imgModel');
var src_url = '';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/downloads', function(req, res, next) {
  request(req.body.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      src_url = req.body.url;
      var $ = cheerio.load(body);
      var imageArr = $('img');
      var imageArgs = Array.prototype.slice.call(imageArr);
      var arr = Array.prototype.slice.call(imageArgs);
      arr = arr.map(function(img){
        return(img.attribs.src);
      });

      async.parallelLimit(arr.map(function(src){
        return imageDownload.bind(null, src);
      }), 5, function(err, results){
        if(err) console.log(err);
        else console.log('Successful!');
      });

      function imageDownload(url, callback){
        var ext = path.extname(url);
        var uid = uuid.v4();
        var filePathName = 'downloads/'+ uid + ext;
        var readStream = request(url);
        var obj ={
          original_url: src_url,
          img_url: url,
          uuid:uid
        };
        var writeStream = fs.createWriteStream(filePathName);
        writeStream.on('finish', function(){
          new imgModel(obj).save(function(err, results){
            if(err) console.log('error connecting Mongo DB:( ' + err);
            else{console.log('Records added to Mongo DB')}
          });
          callback(null, uid);
        });
        readStream.pipe(writeStream);
      }
    }
  });
  res.status(200).json({message: 'OK'});
});
module.exports = router;
