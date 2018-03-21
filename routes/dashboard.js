const express = require('express');
const router = express.Router();
const Sermon = require('../models/sermon');
const Image = require('../models/image');
const moment = require('moment');
const multer  = require('multer');
const cloudinary = require('cloudinary');
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
	  cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
	  cb(null, file.fieldname + Date.now() )
  }
});
let upload = multer({ storage: storage });


let restrictAccess = function(req,res, next){
	if(req.user){
	  next();
	}
	else{
	  res.redirect('/auth/login');
	}
}


/* GET users listing. */
router.get('/', restrictAccess, function(req, res, next) {
  res.render('newsermon', {title:'Dashboard'});
});
router.get('/newsermon',restrictAccess, (req,res,next)=>{
  res.render('newsermon', {
    title:'Add New Sermon'
  });
  
});

//POST sermon
router.post('/newsermon',restrictAccess, upload.single('imgSrc'), (req,res,next)=>{

  //upload a file
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret,
  });
  cloudinary.uploader.upload(req.file.path, function(result) {
    var sermon = new Sermon({
      title:req.body.title,
      link:(req.body.title).split(' ').join('-'),
      index: Date.now(),
      imgSrc: result.url,
      fullData:result,
      by:req.body.presentedBy,
      bibleTxt:req.body.bibleTxt,
      service:req.body.service,
      series:req.body.series,
      date:moment(req.body.date).format("D MMM YYYY"),
      category:req.body.category,
      txt:req.body.txt
    });

    sermon.save(function(err, done){
      if(err) throw err;
      console.log('saving sermon..... sermon saved');
      res.redirect('/dashboard/newsermon');
    });
  },{folder:'lighthouseparish', public_id: req.file.filename});
  
});


// Get media
router.get('/newmedia',restrictAccess, (req,res,next)=>{
  res.render('newmedia', {
    title:'Add New Media File'
  });
  
});
// Add Media
router.post('/newmedia', restrictAccess, upload.single('imgSrc'), (req,res,next)=>{
  //upload a file
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret,
  });
  cloudinary.uploader.upload(req.file.path, function(result) {
    var image = new Image({
      index: Date.now(),
      imgSrc: result.url,
      fullData:result,
      imgDetail:req.body.imgDetail,
      date:moment(req.body.date).format("D MMM YYYY")
    });

    image.save(function(err, done){
      if(err) throw err;
      console.log('saving media..... media uploaded successfully and saved');
      res.redirect('/dashboard/newmedia');
    });
  },{folder:'lighthouseparish/gallery', public_id: req.file.filename});
});

module.exports = router;
