const express = require('express');
const fs = require('fs');
const router = express.Router();
const Sermon = require('../models/sermon');
const Image = require('../models/image');
const Question = require('../models/question');
const bcrypt = require('bcryptjs')
const moment = require('moment');
const multer  = require('multer');
const cloudinary = require('cloudinary');
let storage = multer.memoryStorage(); // Store uploaded images in memory, return buffer
let upload = multer({ storage: storage });

let restrictAccess = function(req,res, next){
	if(req.user){
	  next();
	}
	else{
	  res.redirect('/auth/login');
	}
}
//allow access to Master only.
let masterLogin = function(req,res,next){
	bcrypt.compare(process.env.masterPassword,req.user.password,  function(err, response) {
		if(err) throw err;
		console.log(response);
		// res === true || res === false
		if(req.user.username == process.env.masterUsername && response == true){
			next();
		}
		else{
      req.flash('error', 'You are not authorized to access that page')
			res.redirect('/auth/login');
		}
	});
}

/* GET users listing. */
router.get('/', restrictAccess, masterLogin, function(req, res, next) {
  res.render('newsermon', {title:'Dashboard'});
});
router.get('/newsermon',restrictAccess, masterLogin, (req,res,next)=>{
  res.render('newsermon', {
    title:'Add New Sermon'
  });
  
});

//POST sermon
router.post('/newsermon',restrictAccess, masterLogin, upload.single('imgSrc'), (req,res,next)=>{

  //upload a file
  fs.writeFile('temp.jpg', req.file.buffer, (err, temp)=>{
    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key:process.env.api_key,
      api_secret:process.env.api_secret,
    });
    cloudinary.uploader.upload('temp.jpg', function(result) {
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
    },{folder:'lighthouseparish', public_id: req.file.fieldname + Date.now()});
  });
});


// Get media
router.get('/newmedia',restrictAccess, masterLogin, (req,res,next)=>{
  res.render('newmedia', {
    title:'Add New Media File'
  });
  
});
// Add Media
router.post('/newmedia', restrictAccess, masterLogin, upload.single('imgSrc'), (req,res,next)=>{
  //upload a file
  fs.writeFile('temp.jpg', req.file.buffer, (err, temp)=>{
    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key:process.env.api_key,
      api_secret:process.env.api_secret,
    });
    cloudinary.uploader.upload('temp.jpg', function(result) {
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
    },{folder:'lighthouseparish/gallery', public_id: req.file.fieldname + Date.now()});
  });
});

router.get('/addquestions', restrictAccess, masterLogin, (req,res)=>{
  res.render('addquestions', {title:'Add Questions'})
});
router.post('/addquestions', restrictAccess,masterLogin, (req,res)=>{
  //res.send('You posted to this route...');
  let question = new Question({
    theQuestion:req.body.theQuestion,
    option1:req.body.option1,
    option2:req.body.option2,
    option3:req.body.option3,
    option4:req.body.option4,
    theAnswer:req.body.theAnswer
  });
  question.save(function(err){
    if(err) throw err;
    //console.log(done + 'question saved...');
     res.redirect('/dashboard/addquestions');
  });
});

module.exports = router;
